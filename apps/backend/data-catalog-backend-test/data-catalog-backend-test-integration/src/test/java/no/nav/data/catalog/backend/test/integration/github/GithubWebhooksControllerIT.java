package no.nav.data.catalog.backend.test.integration.github;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.github.GithubConsumer;
import no.nav.data.catalog.backend.app.github.GithubWebhooksController;
import no.nav.data.catalog.backend.app.github.domain.GithubAccount;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallationToken;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.poldatasett.PolDatasett;
import no.nav.data.catalog.backend.app.poldatasett.PolDatasettRepository;
import no.nav.data.catalog.backend.test.component.codelist.CodelistStub;
import no.nav.data.catalog.backend.test.integration.IntegrationTestBase;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.CommitFile;
import org.eclipse.egit.github.core.CommitStatus;
import org.eclipse.egit.github.core.PullRequest;
import org.eclipse.egit.github.core.PullRequestMarker;
import org.eclipse.egit.github.core.RepositoryCommitCompare;
import org.eclipse.egit.github.core.RepositoryContents;
import org.eclipse.egit.github.core.event.PullRequestPayload;
import org.eclipse.egit.github.core.event.PushPayload;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.cloud.contract.wiremock.AutoConfigureWireMock;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.StreamUtils;
import org.testcontainers.shaded.org.apache.commons.lang.StringUtils;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Optional;

import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.exactly;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.matchingJsonPath;
import static com.github.tomakehurst.wiremock.client.WireMock.okJson;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static java.util.Collections.singletonList;
import static no.nav.data.catalog.backend.app.common.utils.JsonUtils.toJson;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("test")
@AutoConfigureWireMock(port = 0)
public class GithubWebhooksControllerIT extends IntegrationTestBase {

    public static final String URL = "/webhooks";
    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected InformationTypeRepository repository;

    @Autowired
    protected PolDatasettRepository polDatasettRepository;
    @Autowired
    private HmacUtils hmacUtils;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Autowired
    protected CodelistService codelistService;

    private String head = "821cd53c03fa042c2a32f0c73ff5612c0a458143";
    private String before = "dbe83db262b1fd082e5cf90053f6196127976e7f";

    @Before
    public void setUp() throws IOException {
        repository.deleteAll();
        CodelistStub.initializeCodelist();
        stubGithub();

        polDatasettRepository.save(new PolDatasett(before));

        repository.save(InformationType.builder()
                .name("removed").description("desc").systemCode("PESYS")
                .elasticsearchStatus(ElasticsearchStatus.SYNCED).producerCode("BRUKER")
                .categoryCode("PERSONALIA").build());
        repository.save(InformationType.builder()
                .name("modified_removed").description("desc").systemCode("PESYS")
                .elasticsearchStatus(ElasticsearchStatus.SYNCED).producerCode("BRUKER")
                .categoryCode("PERSONALIA").build());
        repository.save(InformationType.builder()
                .name("modified_changed").description("desc").systemCode("PESYS")
                .elasticsearchStatus(ElasticsearchStatus.SYNCED).producerCode("BRUKER")
                .categoryCode("PERSONALIA").build());
    }

    @Test
    public void compareAndUpdateOk() {
        PushPayload request = new PushPayload();
        request.setHead(head);
        request.setBefore(before);
        request.setSize(1);
        request.setRef(GithubConsumer.REFS_HEADS_MASTER);

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                URL, HttpMethod.POST, createRequest(request, GithubWebhooksController.PUSH_EVENT), String.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(repository.findAll().size(), is(5));

        Optional<InformationType> added = repository.findByName("added");
        Optional<InformationType> removed = repository.findByName("removed");
        Optional<InformationType> modifiedRemoved = repository.findByName("modified_removed");
        Optional<InformationType> modifiedChanged = repository.findByName("modified_changed");
        Optional<InformationType> modifiedAdded = repository.findByName("modified_added");

        assertTrue(added.isPresent());
        assertTrue(removed.isPresent());
        assertTrue(modifiedAdded.isPresent());
        assertTrue(modifiedChanged.isPresent());
        assertTrue(modifiedRemoved.isPresent());

        assertThat(added.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_CREATED));
        assertThat(removed.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_DELETED));
        assertThat(modifiedAdded.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_CREATED));
        assertThat(modifiedChanged.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_UPDATED));
        assertThat(modifiedRemoved.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_DELETED));

        assertThat(polDatasettRepository.findFirstByOrderByIdDesc().get().getGithubSha(), is(head));
    }

    @Test
    public void pullRequest() {
        PullRequestPayload request = new PullRequestPayload()
                .setAction("opened")
                .setNumber(512)
                .setPullRequest(new PullRequest()
                        .setHead(new PullRequestMarker().setRef("featureBranch").setSha(head))
                        .setBase(new PullRequestMarker().setRef("master").setSha(before))
                );

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                URL, HttpMethod.POST, createRequest(request, GithubWebhooksController.PULL_REQUEST_EVENT), String.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));

        verify(postRequestedFor(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/statuses/%s", head)))
                .withRequestBody(matchingJsonPath("$.context", equalTo("data-catalog-validation")))
                .withRequestBody(matchingJsonPath("$.description", equalTo("ok")))
                .withRequestBody(matchingJsonPath("$.state", equalTo("success")))
        );
    }

    @Test
    public void pullRequestWithValidationErrors() throws IOException {
        stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/modified.json"))
                .withQueryParam("ref", equalTo(head))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/modified.json", readFile("modifiedAfterIncludingAdded.json")))))));

        PullRequestPayload request = new PullRequestPayload()
                .setAction("opened")
                .setNumber(512)
                .setPullRequest(new PullRequest()
                        .setHead(new PullRequestMarker().setRef("featureBranch").setSha(head))
                        .setBase(new PullRequestMarker().setRef("master").setSha(before))
                );

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                URL, HttpMethod.POST, createRequest(request, GithubWebhooksController.PULL_REQUEST_EVENT), String.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));

        verify(postRequestedFor(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/statuses/%s", head)))
                .withRequestBody(matchingJsonPath("$.context", equalTo("data-catalog-validation")))
                .withRequestBody(matchingJsonPath("$.description", equalTo("name=added file=testdataIkkeSlett/added.json ordinal=1 duplicate entry, "
                        + "name=added file=testdataIkkeSlett/modified.json ordinal=3 duplicate entry")))
                .withRequestBody(matchingJsonPath("$.state", equalTo("failure")))
        );
    }

    @Test
    public void pullRequestToNonMaster() {
        PullRequestPayload request = new PullRequestPayload()
                .setAction("opened")
                .setNumber(512)
                .setPullRequest(new PullRequest()
                        .setHead(new PullRequestMarker().setRef("featureBranch").setSha(head))
                        .setBase(new PullRequestMarker().setRef("develop").setSha(before))
                );

        ResponseEntity<String> responseEntity = restTemplate.exchange(
                URL, HttpMethod.POST, createRequest(request, GithubWebhooksController.PULL_REQUEST_EVENT), String.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));

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

    private void stubGithub() throws IOException {
        stubFor(get(urlPathEqualTo("/app/installations"))
                .willReturn(okJson(toJson(new GithubInstallation[]{new GithubInstallation("installId", new GithubAccount("navikt"))}))));
        stubFor(post(urlPathEqualTo("/app/installations/installId/access_tokens"))
                .willReturn(okJson(toJson(new GithubInstallationToken("githubToken"))).withStatus(HttpStatus.CREATED.value())));

        stubFor(get(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/compare/%s...%s", before, head)))
                .willReturn(okJson(toJson(new RepositoryCommitCompare()
                        .setFiles(Arrays.asList(
                                new CommitFile().setStatus("added").setFilename("testdataIkkeSlett/added.json"),
                                new CommitFile().setStatus("modified").setFilename("testdataIkkeSlett/modified.json"),
                                new CommitFile().setStatus("removed").setFilename("testdataIkkeSlett/removed.json")
                        ))))));

        // github files
        stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/added.json"))
                .withQueryParam("ref", equalTo(head))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/added.json", readFile("added.json")))))));

        stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/modified.json"))
                .withQueryParam("ref", equalTo(before))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/modified.json", readFile("modifiedBefore.json")))))));

        stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/modified.json"))
                .withQueryParam("ref", equalTo(head))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/modified.json", readFile("modifiedAfter.json")))))));

        stubFor(get(urlPathEqualTo("/api/v3/repos/navikt/pol-datasett/contents/testdataIkkeSlett/removed.json"))
                .withQueryParam("ref", equalTo(before))
                .willReturn(okJson(toJson(singletonList(createFile("testdataIkkeSlett/removed.json", readFile("removed.json")))))));

        // Github statuses
        stubFor(post(urlPathEqualTo(String.format("/api/v3/repos/navikt/pol-datasett/statuses/%s", head)))
                .willReturn(okJson(toJson(new CommitStatus()))));
    }

    private RepositoryContents createFile(String path, byte[] content) {
        return new RepositoryContents()
                .setName(StringUtils.substringAfterLast(path, "/"))
                .setPath(path)
                .setType(RepositoryContents.TYPE_FILE)
                .setEncoding(RepositoryContents.ENCODING_BASE64)
                .setContent(Base64.getEncoder().encodeToString(content));
    }

    private byte[] readFile(String path) throws IOException {
        return StreamUtils.copyToByteArray(new ClassPathResource("github/" + path).getInputStream());
    }
}
