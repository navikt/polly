package no.nav.data.catalog.backend.app.github;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.RepositoryId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GithubConfig {

    @Bean
    public GitHubClient gitHubClient() {
        return new GitHubClient();
    }

    @Bean
    public RepositoryId repositoryId(@Value("${pol.datasett.owner}") String owner, @Value("${pol.datasett.repo}") String repo) {
        return new RepositoryId(owner, repo);
    }

    @Bean
    public HmacUtils githubHmac(@Value("${github.webhooks.secret}") String githubSecret) {
        return new HmacUtils(HmacAlgorithms.HMAC_SHA_1, githubSecret);
    }
}
