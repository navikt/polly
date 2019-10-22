package no.nav.data.polly.informationtype;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InformationTypeRepository extends JpaRepository<InformationType, UUID> {

    Optional<InformationType> findByName(String name);

    List<InformationType> findAllByNameIn(List<String> title);

}
