package no.nav.data.polly.common.security.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


public interface AuthRepository extends JpaRepository<Auth, UUID> {

    List<Auth> findByInitiatedBefore(LocalDateTime time);

    long countDistinctUserIdByLastActiveAfter(LocalDateTime time);
}
