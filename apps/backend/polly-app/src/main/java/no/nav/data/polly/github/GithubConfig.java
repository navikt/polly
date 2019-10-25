package no.nav.data.polly.github;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.RepositoryId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GithubConfig {

    @Bean
    public GitHubClient gitHubClient(GithubProperties githubProperties) {
        return new GitHubClient(githubProperties.getHost(), githubProperties.getPort(), githubProperties.getScheme());
    }

    @Bean
    public RepositoryId repositoryId(@Value("${github.status.owner}") String owner, @Value("${github.status.repo}") String repo) {
        return new RepositoryId(owner, repo);
    }

    @Bean
    public HmacUtils githubHmac(GithubProperties githubProperties) {
        return new HmacUtils(HmacAlgorithms.HMAC_SHA_1, githubProperties.getWebhooksSecret());
    }
}
