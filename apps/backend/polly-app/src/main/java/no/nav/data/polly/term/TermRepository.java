package no.nav.data.polly.term;

import no.nav.data.polly.informationtype.InformationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TermRepository extends JpaRepository<Term, UUID> {

    Optional<InformationType> findByName(String name);

    List<InformationType> findAllByNameIn(List<String> title);
}
