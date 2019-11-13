package no.nav.data.polly.github;

import no.nav.data.polly.AppStarter;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.github.domain.status.GithubStatus;
import no.nav.data.polly.github.domain.status.GithubStatusRepository;
import no.nav.data.polly.github.dto.RepoModification;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.InformationTypeService;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.Commit;
import org.eclipse.egit.github.core.CommitUser;
import org.eclipse.egit.github.core.PullRequest;
import org.eclipse.egit.github.core.PullRequestMarker;
import org.eclipse.egit.github.core.RepositoryContents;
import org.eclipse.egit.github.core.User;
import org.eclipse.egit.github.core.event.PullRequestPayload;
import org.eclipse.egit.github.core.event.PushPayload;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static no.nav.data.polly.github.GithubWebhooksController.HEADER_GITHUB_EVENT;
import static no.nav.data.polly.github.GithubWebhooksController.HEADER_GITHUB_ID;
import static no.nav.data.polly.github.GithubWebhooksController.HEADER_GITHUB_SIGNATURE;
import static no.nav.data.polly.github.GithubWebhooksController.PULL_REQUEST_EVENT;
import static no.nav.data.polly.github.GithubWebhooksController.PUSH_EVENT;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.mockito.internal.verification.VerificationModeFactory.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(GithubWebhooksController.class)
@ContextConfiguration(classes = {AppStarter.class, GithubConfig.class, GithubProperties.class})
@ActiveProfiles("test")
class GithubWebhooksControllerTest {

    @Autowired
    private MockMvc mvc;
    @Autowired
    private HmacUtils githubHmac;

    @MockBean
    private InformationTypeRepository repository;
    @MockBean
    private InformationTypeService service;
    @MockBean
    private GithubStatusRepository githubStatusRepository;
    @MockBean
    private GithubConsumer githubConsumer;

    private RepoModification repoModification;
    private PullRequestPayload pullRequest;
    private PushPayload push;

    @BeforeEach
    void setUp() {
        repoModification = RepoModification.builder()
                .added(singletonList(createFile("add.json", "added")))
                .modifiedBefore(singletonList(createFile("mod.json", "modified")))
                .modifiedAfter(singletonList(createFile("mod.json", "modified")))
                .deleted(singletonList(createFile("rem.json", "removed")))
                .build();
        when(githubConsumer.compare("base", "head")).thenReturn(repoModification);
        when(githubStatusRepository.findFirstByOrderByIdDesc()).thenReturn(Optional.of(new GithubStatus("internalbefore")));

        pullRequest = new PullRequestPayload()
                .setAction("edited")
                .setPullRequest(new PullRequest()
                        .setUser(new User().setName("githubuser"))
                        .setBase(new PullRequestMarker().setSha("base").setRef("master"))
                        .setHead(new PullRequestMarker().setSha("head").setRef("prbranch"))
                );
        push = new PushPayload()
                .setBefore("githubbefore")
                .setHead("head")
                .setCommits(List.of(new Commit().setSha("head").setAuthor(new CommitUser().setName("githubuser"))))
                .setRef(GithubConsumer.REFS_HEADS_MASTER);
    }

    @Test
    void invalidSignature() throws Exception {
        String payload = JsonUtils.toJson(pullRequest);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=fdsaatfdsdfasgdfuasd")
        ).andExpect(status().isForbidden());

        verifyNoInteractions(service, githubConsumer);
    }

    @Test
    void pullRequets() throws Exception {
        String payload = JsonUtils.toJson(pullRequest);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verify(service, times(2)).validateRequestsAndReturnErrors(anyList());
        verify(githubConsumer).updateStatus("head", Collections.emptyList());
    }

    @Test
    void pullRequestWrongToBranch() throws Exception {
        pullRequest.getPullRequest().getBase().setRef("someone_is_trying_something");
        String payload = JsonUtils.toJson(pullRequest);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verifyNoInteractions(githubConsumer, service);
    }


    @Test
    void pullRequestWrongAction() throws Exception {
        pullRequest.setAction("closed");
        String payload = JsonUtils.toJson(pullRequest);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verifyNoInteractions(githubConsumer, service);
    }

    @Test
    void pullRequestValidationFailure() throws Exception {
        repoModification.setAdded(singletonList(createFile("add.json", "modified")));
        String payload = JsonUtils.toJson(pullRequest);

        List<ValidationError> validationErrors = List.of(new ValidationError("title=modified path=add.json ordinal=1 duplicate entry",
                "DuplicatedIdentifyingFields", "Multipe elements in this request are using the same unique fields (modified)"));

        when(service.validateRequestsAndReturnErrors(anyList())).thenReturn(validationErrors).thenReturn(emptyList());

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PULL_REQUEST_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verify(service).validateNoDuplicates(anyList());
        verify(service, times(2)).validateRequestsAndReturnErrors(anyList());
        verify(githubConsumer).updateStatus("head", validationErrors);
    }

    @Test
    void updateOnPush() throws Exception {
        when(githubConsumer.compare("internalbefore", "head")).thenReturn(repoModification);
        when(repository.findByName("removed")).then(i -> Optional.of(InformationType.builder().generateId().build()));
        String payload = JsonUtils.toJson(push);

        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PUSH_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());

        verify(service, times(2)).validateRequestsAndReturnErrors(anyList());
        verify(service).saveAll(anyList());
        verify(service).updateAll(anyList());
        verify(service).deleteAll(anyList());
    }

    @Test
    void updateWrongBranch() throws Exception {
        push.setRef("refs/heads/someotherbranch");
        String payload = JsonUtils.toJson(push);
        mvc.perform(post(GithubWebhooksController.BACKEND_WEBHOOKS)
                .content(payload)
                .header(HEADER_GITHUB_EVENT, PUSH_EVENT)
                .header(HEADER_GITHUB_ID, UUID.randomUUID().toString())
                .header(HEADER_GITHUB_SIGNATURE, "sha1=" + githubHmac.hmacHex(payload))
        ).andExpect(status().isOk());
        verifyNoInteractions(service, repository, githubStatusRepository);
    }

    private RepositoryContents createFile(String file, String name) {
        return new RepositoryContents().setName(name).setPath(file)
                .setType(RepositoryContents.TYPE_FILE).setEncoding(RepositoryContents.ENCODING_BASE64)
                .setContent(Base64.getEncoder()
                        .encodeToString(JsonUtils.toJson(InformationTypeRequest.builder().name(name).build()).getBytes()));
    }
}