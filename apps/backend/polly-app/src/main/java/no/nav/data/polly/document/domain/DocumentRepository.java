package no.nav.data.polly.document.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID>, DocumentRepositoryCustom {

    @Query(value = "select * from document where data ->>'name' ilike %?1%", nativeQuery = true)
    List<Document> findByNameLike(String name);

    @Query(value = "select * from document where data ->> 'dataAccessClass' = ?1", nativeQuery = true)
    List<Document> findByDataAccessClass(String dataAccessClass);
}
