package no.nav.data.polly.github.domain.status;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GithubStatusRepository extends JpaRepository<GithubStatus, Long> {

    Optional<GithubStatus> findFirstByOrderByIdDesc();
}
