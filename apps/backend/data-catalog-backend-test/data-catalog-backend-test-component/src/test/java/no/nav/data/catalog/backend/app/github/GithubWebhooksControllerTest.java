package no.nav.data.catalog.backend.app.github;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.common.validator.ValidationError;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetMaster;
import no.nav.data.catalog.backend.app.dataset.DatasetRequest;
import no.nav.data.catalog.backend.app.dataset.DatasetService;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.github.domain.RepoModification;
import no.nav.data.catalog.backend.app.poldatasett.PolDatasett;
import no.nav.data.catalog.backend.app.poldatasett.PolDatasettRepository;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.PullRequest;
import org.eclipse.egit.github.core.PullRequestMarker;
import org.eclipse.egit.github.core.RepositoryContents;
import org.eclipse.egit.github.core.event.PullRequestPayload;
import org.eclipse.egit.github.core.event.PushPayload;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.AdditionalAnswers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.Collections.singletonList;
import static no.nav.data.catalog.backend.app.github.GithubWebhooksController.HEADER_GITHUB_EVENT;
import static no.nav.data.catalog.backend.app.github.GithubWebhooksController.HEADER_GITHUB_ID;
import static no.nav.data.catalog.backend.app.github.GithubWebhooksController.HEADER_GITHUB_SIGNATURE;
import static no.nav.data.catalog.backend.app.github.GithubWebhooksController.PULL_REQUEST_EVENT;
import static no.nav.data.catalog.backend.app.github.GithubWebhooksController.PUSH_EVENT;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyZeroInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(GithubWebhooksController.class)
@ContextConfiguration(classes = {AppStarter.class, GithubConfig.class, GithubProperties.class})
@ActiveProfiles("test")
public class GithubWebhooksControllerTest {

    @Autowired
    private MockMvc mvc;
    @Autowired
    private HmacUtils githubHmac;

    @MockBean
    private DatasetRepository repository;
    @MockBean
    private DatasetService service;
    @MockBean
    private PolDatasettRepository polDatasettRepository;
    @MockBean
    private GithubConsumer githubConsumer;

    private RepoModification repoModification;
    private PullRequestPayload pullRequest;
    private PushPayload push;

    @Before
    public void setUp() {
        repoModification = RepoModification.builder()
                .added(singletonList(createFile("add.json", "added")))
                .modifiedBefore(singletonList(createFile("mod.json", "modified")))
                .modifiedAfter(singletonList(createFile("mod.json", "modified")))
                .deleted(singletonList(createFile("rem.json", "removed")))
                .build();
        when(githubConsumer.compare("base", "head")).thenReturn(repoModification);
        when(polDatasettRepository.findFirstByOrderByIdDesc()).thenReturn(Optional.of(new PolDatasett("internalbefore")));

        pullRequest = new PullRequestPayload()
                .setAction("edited")
                .setPullRequest(new PullRequest()
                        .setBase(new PullRequestMarker().setSha("base").setRef("master"))
                        .setHead(new PullRequestMarker().setSha("head").setRef("prbranch"))
                );
        push = new PushPayload()
                .setBefore("githubbefore")
                .setHead("head")
                .setRef(GithubConsumer.REFS_HEADS_MASTER);
    }

    @Test
    public void invalidSignature() throws Exception {
        String payload = JsonUtils.toJson(pullRequest);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=fdsaatfdsdfasgdfuasd")
        ).andExpect(status().isForbidden());

        verifyZeroInteractions(service, githubConsumer);
    }

    @Test
    public void pullRequets() throws Exception {
        String payload = JsonUtils.toJson(pullRequest);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verify(service).validateRequestsAndReturnErrors(anyList(), eq(true), any(DatasetMaster.class));
        verify(service).validateRequestsAndReturnErrors(anyList(), eq(false), any(DatasetMaster.class));
        verify(githubConsumer).updateStatus("head", Collections.emptyList());
    }

    @Test
    public void pullRequestWrongToBranch() throws Exception {
        pullRequest.getPullRequest().getBase().setRef("someone_is_trying_something");
        String payload = JsonUtils.toJson(pullRequest);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verifyZeroInteractions(githubConsumer, service);
    }


    @Test
    public void pullRequestWrongAction() throws Exception {
        pullRequest.setAction("closed");
        String payload = JsonUtils.toJson(pullRequest);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verifyZeroInteractions(githubConsumer, service);
    }

    @Test
    public void pullRequestValidationFailure() throws Exception {
        repoModification.setAdded(singletonList(createFile("add.json", "modified")));
        String payload = JsonUtils.toJson(pullRequest);

        List<ValidationError> validationErrors = List.of(new ValidationError("title=modified path=add.json ordinal=1 duplicate entry",
                "DuplicatedIdentifyingFields", "Multipe elements in this request are using the same unique fields (modified)"));

        when(service.validateRequestsAndReturnErrors(anyList(), eq(true), any(DatasetMaster.class))).thenReturn(validationErrors);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());


        verify(service).validateNoDuplicates(anyList());
        verify(service).validateRequestsAndReturnErrors(anyList(), eq(true), any(DatasetMaster.class));
        verify(service).validateRequestsAndReturnErrors(anyList(), eq(false), any(DatasetMaster.class));
        verify(githubConsumer).updateStatus("head", validationErrors);
    }

    @Test
    public void updateOnPush() throws Exception {
        when(githubConsumer.compare("internalbefore", "head")).thenReturn(repoModification);
        when(repository.findByTitle("removed")).then(i -> Optional.of(new Dataset()));
        when(service.returnUpdatedDatasetsIfAllArePresent(anyList())).then(AdditionalAnswers.returnsArgAt(0));
        String payload = JsonUtils.toJson(push);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PUSH_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verify(service).validateRequestsAndReturnErrors(anyList(), eq(true), any(DatasetMaster.class));
        verify(service).validateRequestsAndReturnErrors(anyList(), eq(false), any(DatasetMaster.class));

        verify(repository, times(3)).saveAll(anyCollection());
    }

    @Test
    public void updateWrongBranch() throws Exception {
        push.setRef("refs/heads/someotherbranch");
        String payload = JsonUtils.toJson(push);
        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PUSH_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());
        verifyZeroInteractions(service, repository, polDatasettRepository);
    }

    private RepositoryContents createFile(String file, String name) {
        return new RepositoryContents().setName(name).setPath(file)
                .setType(RepositoryContents.TYPE_FILE).setEncoding(RepositoryContents.ENCODING_BASE64)
                .setContent(Base64.getEncoder()
                        .encodeToString(JsonUtils.toJson(DatasetRequest.builder().title(name).build()).getBytes()));
    }
}