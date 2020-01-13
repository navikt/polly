package no.nav.data.polly.disclosure.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DisclosureRepository extends JpaRepository<Disclosure, UUID>, DisclosureRepositoryCustom {

}
