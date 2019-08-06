package no.nav.data.catalog.backend.app.github;

public class GitHubClient extends org.eclipse.egit.github.core.client.GitHubClient {

    GitHubClient(String hostname, int port, String scheme) {
        super(hostname, port, scheme);
    }

    String getBaseUri() {
        return baseUri;
    }
}
