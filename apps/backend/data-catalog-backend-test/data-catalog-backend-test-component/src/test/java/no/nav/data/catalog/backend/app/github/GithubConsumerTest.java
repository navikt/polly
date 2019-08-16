package no.nav.data.catalog.backend.app.github;

import static java.util.Arrays.asList;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import no.nav.data.catalog.backend.app.common.tokensupport.JwtTokenGenerator;
import no.nav.data.catalog.backend.app.github.GitHubClient;
import no.nav.data.catalog.backend.app.github.GithubConsumer;
import no.nav.data.catalog.backend.app.github.domain.GithubAccount;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallation;
import no.nav.data.catalog.backend.app.github.domain.GithubInstallationToken;
import no.nav.data.catalog.backend.app.github.domain.RepoModification;
import org.eclipse.egit.github.core.CommitFile;
import org.eclipse.egit.github.core.CommitStatus;
import org.eclipse.egit.github.core.RepositoryCommit;
import org.eclipse.egit.github.core.RepositoryCommitCompare;
import org.eclipse.egit.github.core.RepositoryContents;
import org.eclipse.egit.github.core.RepositoryId;
import org.eclipse.egit.github.core.client.GitHubRequest;
import org.eclipse.egit.github.core.client.GitHubResponse;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestTemplate;

@RunWith(MockitoJUnitRunner.class)
@ActiveProfiles("test")
public class GithubConsumerTest {

    @Mock
    private RestTemplate restTemplate;
    @Mock
    private JwtTokenGenerator jwtTokenGenerator;
    @Mock
    private GitHubClient gitHubClient;
    @Spy
    private RepositoryId repositoryId = new RepositoryId("owner", "name");

    @InjectMocks
    private GithubConsumer githubConsumer;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();
    @Captor
    private ArgumentCaptor<Map<String, String>> mapCaptor;

    @Test
    public void getContents() throws IOException {
        RepositoryContents repositoryContents = new RepositoryContents();
        when(gitHubClient.get(any(GitHubRequest.class))).thenReturn(new GitHubResponse(null, repositoryContents));
        List<RepositoryContents> fileInfo = githubConsumer.getContents("master", "filename.json");
        assertThat(fileInfo.get(0), is(repositoryContents));
    }

    @Test
    public void getMaster() throws IOException {
        String master = "12512";
        when(gitHubClient.get(any(GitHubRequest.class))).thenReturn(new GitHubResponse(null, new RepositoryCommit().setSha(master)));
        assertThat(githubConsumer.getShaOfMaser(), is(master));
    }

    @Test
    public void updateStatusOk() throws IOException {
        String sha = "12512";
        when(gitHubClient.post(anyString(), mapCaptor.capture(), any())).thenReturn(new CommitStatus());
        githubConsumer.updateStatus(sha, Collections.emptyList());

        Map<String, String> value = mapCaptor.getValue();
        assertThat(value.get("state"), is(CommitStatus.STATE_SUCCESS));
        assertThat(value.get("description"), is("ok"));
        assertThat(value.get("context"), is("data-catalog-validation"));
    }

    @Test
    public void updateStatusFailure() throws IOException {
        String sha = "12512";
        when(gitHubClient.post(anyString(), mapCaptor.capture(), any())).thenReturn(new CommitStatus());
        githubConsumer.updateStatus(sha, asList("feil1", "feil2"));

        Map<String, String> value = mapCaptor.getValue();
        assertThat(value.get("state"), is(CommitStatus.STATE_FAILURE));
        assertThat(value.get("description"), is("feil1, feil2"));
        assertThat(value.get("context"), is("data-catalog-validation"));
    }

    @Test
    public void compare() throws IOException {
        RepositoryCommitCompare compare = new RepositoryCommitCompare().setFiles(asList(
                new CommitFile().setStatus("added").setFilename("addedfilename"),
                new CommitFile().setStatus("modified").setFilename("modifiedfilename"),
                new CommitFile().setStatus("removed").setFilename("removedfilename"))
        );
        when(gitHubClient.get(argThat(r -> r != null && r.getUri().contains("compare")))).thenReturn(new GitHubResponse(null, compare));
        when(gitHubClient.get(argThat(r -> r != null && r.getUri().contains("contents"))))
                .then(i -> new GitHubResponse(null, new RepositoryContents().setName(i.<GitHubRequest>getArgument(0).generateUri())));

        RepoModification modification = githubConsumer.compare("start", "end");

        assertThat(modification.size(), is(4));
        assertThat(modification.getHead(), is("end"));
        assertThat(modification.getAdded().get(0).getName(), is("/repos/owner/name/contents/addedfilename?ref=end"));
        assertThat(modification.getModifiedAfter().get(0).getName(), is("/repos/owner/name/contents/modifiedfilename?ref=end"));
        assertThat(modification.getModifiedBefore().get(0).getName(), is("/repos/owner/name/contents/modifiedfilename?ref=start"));
        assertThat(modification.getDeleted().get(0).getName(), is("/repos/owner/name/contents/removedfilename?ref=start"));
    }

    @Before
    public void mockToken() {
        GithubInstallation installation = new GithubInstallation("1", new GithubAccount(repositoryId.getOwner()));
        GithubInstallation[] installations = {installation};
        GithubInstallationToken token = new GithubInstallationToken("token");
        //Installation
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallation[].class)))
                .thenReturn(new ResponseEntity<>(installations, HttpStatus.OK));
        //Token
        when(restTemplate.exchange(anyString(), any(HttpMethod.class), any(HttpEntity.class), eq(GithubInstallationToken.class)))
                .thenReturn(new ResponseEntity<>(token, HttpStatus.OK));
    }
}