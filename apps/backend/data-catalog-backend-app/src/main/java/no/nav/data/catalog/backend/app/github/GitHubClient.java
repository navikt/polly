package no.nav.data.catalog.backend.app.github;

public class GitHubClient extends org.eclipse.egit.github.core.client.GitHubClient {

    String getBaseUri() {
        return baseUri;
    }
}
