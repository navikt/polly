package no.nav.data.polly.disclosure.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DisclosureRepository extends JpaRepository<Disclosure, UUID>, DisclosureRepositoryCustom {

    List<Disclosure> findByInformationTypesId(UUID informationTypeId);
}
