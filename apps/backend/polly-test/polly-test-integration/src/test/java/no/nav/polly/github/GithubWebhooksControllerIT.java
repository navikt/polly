package no.nav.polly.github;

import com.github.tomakehurst.wiremock.client.WireMock;
import no.nav.polly.IntegrationTestBase;
import no.nav.polly.codelist.CodelistStub;
import no.nav.polly.dataset.DatacatalogMaster;
import no.nav.polly.dataset.Dataset;
import no.nav.polly.dataset.DatasetRequest;
import no.nav.polly.dataset.repo.DatasetRepository;
import no.nav.polly.distributionchannel.DistributionChannel;
import no.nav.polly.distributionchannel.DistributionChannelRepository;
import no.nav.polly.distributionchannel.DistributionChannelType;
import no.nav.polly.elasticsearch.ElasticsearchStatus;
import no.nav.polly.github.domain.GithubAccount;
import no.nav.polly.github.domain.GithubInstallation;
import no.nav.polly.github.domain.GithubInstallationToken;
import no.nav.polly.github.poldatasett.PolDatasett;
import no.nav.polly.github.poldatasett.PolDatasettRepository;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.Commit;
import org.eclipse.egit.github.core.CommitFile;
import org.eclipse.egit.github.core.CommitStatus;
import org.eclipse.egit.github.core.CommitUser;
import org.eclipse.egit.github.core.PullRequest;
import org.eclipse.egit.github.core.PullRequestMarker;
import org.eclipse.egit.github.core.RepositoryCommitCompare;
import org.eclipse.egit.github.core.RepositoryContents;
import org.eclipse.egit.github.core.User;
import org.eclipse.egit.github.core.event.PullRequestPayload;
import org.eclipse.egit.github.core.event.PushPayload;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.testcontainers.shaded.org.apache.commons.lang.StringUtils;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.github.tomakehurst.wiremock.client.WireMock.containing;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.exactly;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.matchingJsonPath;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static java.util.Collections.singletonList;
import static no.nav.polly.TestUtil.readFile;
import static no.nav.polly.common.utils.JsonUtils.toJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;


class GithubWebhooksControllerIT extends IntegrationTestBase {

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected DatasetRepository repository;
    @Autowired
    protected DistributionChannelRepository distributionChannelRepository;
    @Autowired
    protected PolDatasettRepository polDatasettRepository;
    @Autowired
    private HmacUtils hmacUtils;

    private static final String head = "821cd53c03fa042c2a32f0c73ff5612c0a458143";
    private static final String before = "dbe83db262b1fd082e5cf90053f6196127976e7f";

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
        stubGithub();
        repository.deleteAll();
        distributionChannelRepository.deleteAll();
        polDatasettRepository.save(new PolDatasett(before));

        distributionChannelRepository.save(DistributionChannel.builder().id(UUID.randomUUID()).name("aapen-dok-mottatt").type(DistributionChannelType.KAFKA).build());

        repository.save(createDataset("removed"));
        repository.save(createDataset("modified_removed"));
        repository.save(createDataset("modified_changed"));
    }

    @Test
    void compareAndUpdateOk() {
        PushPayload request = new PushPayload();
        request.setHead(head);
        request.setBefore(before);
        request.setSize(1);
        request.setCommits(List.of(new Commit().setSha(head).setAuthor(new CommitUser().setName("username"))));
        request.setRef(GithubConsumer.REFS_HEADS_MASTER);

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/webhooks", HttpMethod.POST, createRequest(request, GithubWebhooksController.PUSH_EVENT), String.class);

        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<Dataset> all = repository.findAll();
        assertThat(all.size()).isEqualTo(5);

        Optional<Dataset> added = repository.findByTitle("added");
        Optional<Dataset> removed = repository.findByTitle("removed");
        Optional<Dataset> modifiedRemoved = repository.findByTitle("modified_removed");
        Optional<Dataset> modifiedChanged = repository.findByTitle("modified_changed");
        Optional<Dataset> modifiedAdded = repository.findByTitle("modified_added");


        assertTrue(added.isPresent());
        assertTrue(removed.isPresent());
        assertTrue(modifiedAdded.isPresent());
        assertTrue(modifiedChanged.isPresent());
        assertTrue(modifiedRemoved.isPresent());

        assertThat(added.get().getCreatedBy()).isEqualTo("github username");
        assertThat(added.get().getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_CREATED);
        assertThat(removed.get().getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_DELETED);
        assertThat(modifiedAdded.get().getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_CREATED);
        assertThat(modifiedChanged.get().getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_UPDATED);
        assertThat(modifiedRemoved.get().getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_DELETED);

        assertThat(polDatasettRepository.findFirstByOrderByIdDesc().get().getGithubSha()).isEqualTo(head);
    }

    @Test
    void pullRequest() {
        PullRequestPayload request = new PullRequestPayload()
                .setAction("opened")
                .setNumber(512)
                .setPullRequest(new PullRequest()
                        .setUser(new User().setName("githubuser"))
                        .setHead(new PullRequestMarker().setRef("featureBranch").setSha(head))
                        .setBase(new PullRequestMarker().setRef("master").setSha(before))
                );

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/webhooks", HttpMethod.POST, createRequest(request, GithubWebhooksController.PULL_REQUEST_EVENT), String.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

        verify(postRequestedFor(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/statuses/%s", head)))
                .withRequestBody(matchingJsonPath("$.context", equalTo("polly-validation")))
                .withRequestBody(matchingJsonPath("$.description", equalTo("ok")))
                .withRequestBody(matchingJsonPath("$.state", equalTo("success")))
        );
    }

    @Test
    void pullRequestWithValidationErrors() {
        WireMock.stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/modified.json"))
                .withQueryParam("ref", equalTo(head))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/modified.json", readFile("github/modifiedAfterIncludingAdded.json")))))));

        PullRequestPayload request = new PullRequestPayload()
                .setAction("opened")
                .setNumber(512)
                .setPullRequest(new PullRequest()
                        .setUser(new User().setName("githubuser"))
                        .setHead(new PullRequestMarker().setRef("featureBranch").setSha(head))
                        .setBase(new PullRequestMarker().setRef("master").setSha(before))
                );

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/webhooks", HttpMethod.POST, createRequest(request, GithubWebhooksController.PULL_REQUEST_EVENT), String.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

        verify(postRequestedFor(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/statuses/%s", head)))
                .withRequestBody(matchingJsonPath("$.context", equalTo("polly-validation")))
                .withRequestBody(matchingJsonPath("$.description",
                        containing("added -- DuplicatedIdentifyingFields -- Multiple elements in this request are using the same unique fields (added)")))
                .withRequestBody(matchingJsonPath("$.state", equalTo("failure")))
        );
    }

    @Test
    void pullRequestToNonMaster() {
        PullRequestPayload request = new PullRequestPayload()
                .setAction("opened")
                .setNumber(512)
                .setPullRequest(new PullRequest()
                        .setUser(new User().setName("githubuser"))
                        .setHead(new PullRequestMarker().setRef("featureBranch").setSha(head))
                        .setBase(new PullRequestMarker().setRef("develop").setSha(before))
                );

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "/webhooks", HttpMethod.POST, createRequest(request, GithubWebhooksController.PULL_REQUEST_EVENT), String.class);
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

        verify(exactly(0), postRequestedFor(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/statuses/%s", head))));
    }

    private HttpEntity<String> createRequest(Object request, String event) {
        String payload = toJson(request);
        HttpHeaders headers = new HttpHeaders();
        headers.add(GithubWebhooksController.HEADER_GITHUB_EVENT, event);
        headers.add(GithubWebhooksController.HEADER_GITHUB_ID, "123");
        headers.add(GithubWebhooksController.HEADER_GITHUB_SIGNATURE, "sha1=" + hmacUtils.hmacHex(payload));
        return new HttpEntity<>(payload, headers);
    }

    private void stubGithub() {
        WireMock.reset();
        WireMock.stubFor(get(urlPathEqualTo("/app/installations"))
                .willReturn(okJson(toJson(new GithubInstallation[]{new GithubInstallation("installId", new GithubAccount("navikt"))}))));
        WireMock.stubFor(post(urlPathEqualTo("/app/installations/installId/access_tokens"))
                .willReturn(okJson(toJson(new GithubInstallationToken("githubToken"))).withStatus(HttpStatus.CREATED.value())));

        WireMock.stubFor(get(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/compare/%s...%s", before, head)))
                .willReturn(okJson(toJson(new RepositoryCommitCompare()
                        .setFiles(Arrays.asList(
                                new CommitFile().setStatus("added").setFilename("testdataIkkeSlett/added.json"),
                                new CommitFile().setStatus("modified").setFilename("testdataIkkeSlett/modified.json"),
                                new CommitFile().setStatus("removed").setFilename("testdataIkkeSlett/removed.json")
                        ))))));

        // github files
        WireMock.stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/added.json"))
                .withQueryParam("ref", equalTo(head))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/added.json", readFile("github/added.json")))))));

        WireMock.stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/modified.json"))
                .withQueryParam("ref", equalTo(before))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/modified.json", readFile("github/modifiedBefore.json")))))));

        WireMock.stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/modified.json"))
                .withQueryParam("ref", equalTo(head))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/modified.json", readFile("github/modifiedAfter.json")))))));

        WireMock.stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/removed.json"))
                .withQueryParam("ref", equalTo(before))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/removed.json", readFile("github/removed.json")))))));

        // Github statuses
        WireMock.stubFor(post(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/statuses/%s", head)))
                .willReturn(okJson(toJson(new CommitStatus()))));
    }

    private static RepositoryContents createFile(String path, String content) {
        return new RepositoryContents()
                .setName(StringUtils.substringAfterLast(path, "/"))
                .setPath(path)
                .setType(RepositoryContents.TYPE_FILE)
                .setEncoding(RepositoryContents.ENCODING_BASE64)
                .setContent(Base64.getEncoder().encodeToString(content.getBytes()));
    }

    private Dataset createDataset(String removed) {
        Dataset dataset = new Dataset().convertNewFromRequest(DatasetRequest.builder()
                .title(removed)
                .description("desc")
                .build(), DatacatalogMaster.GITHUB);
        dataset.setElasticsearchStatus(ElasticsearchStatus.SYNCED);
        return dataset;
    }
}
