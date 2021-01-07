package no.nav.data.polly.disclosure.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisclosureRepository extends JpaRepository<Disclosure, UUID>, DisclosureRepositoryCustom {

    @Query(value = "select * from disclosure where data ->> 'documentId' = ?1", nativeQuery = true)
    List<Disclosure> findByDocumentId(String uuid);

    @Query(value = "select * from disclosure where data ->> 'name' ilike %?1%", nativeQuery = true)
    List<Disclosure> findByNameContaining(String name);

}
