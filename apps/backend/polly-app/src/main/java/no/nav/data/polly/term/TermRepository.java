package no.nav.data.polly.term;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TermRepository extends JpaRepository<Term, UUID> {

    Optional<Term> findByName(String name);

    List<Term> findAllByNameIn(List<String> title);
}
