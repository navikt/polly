package no.nav.polly.github;

public class GitHubClient extends org.eclipse.egit.github.core.client.GitHubClient {

    GitHubClient(String hostname, int port, String scheme) {
        super(hostname, port, scheme);
    }

    String getBaseUri() {
        return baseUri;
    }
}
