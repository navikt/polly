package no.nav.data.polly.github.status;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GithubStatusRepository extends JpaRepository<GithubStatus, Long> {

    Optional<GithubStatus> findFirstByOrderByIdDesc();
}
