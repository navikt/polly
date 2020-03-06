package no.nav.data.polly.security;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.common.security.domain.Auth;
import no.nav.data.polly.common.security.domain.AuthRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class AuthIT extends IntegrationTestBase {

    @Autowired
    private AuthRepository repository;

    @Test
    void countActiveUsers() {
        repository.save(createAuth("1", LocalDateTime.now()));
        repository.save(createAuth("1", LocalDateTime.now()));
        repository.save(createAuth("1", LocalDateTime.now().minusDays(1)));
        repository.save(createAuth("2", LocalDateTime.now()));
        repository.save(createAuth("3", LocalDateTime.now().minusHours(2)));
        repository.save(createAuth("4", LocalDateTime.now().minusDays(1)));

        assertThat(repository.countDistinctUserIdByLastActiveAfter(LocalDateTime.now().minusHours(1))).isEqualTo(2L);
    }

    private Auth createAuth(String s, LocalDateTime now) {
        return Auth.builder().generateId().encryptedRefreshToken("a").initiated(LocalDateTime.now().minusDays(2)).userId(s).lastActive(now).build();
    }
}
