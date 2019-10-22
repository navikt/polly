package no.nav.data.polly.informationtype;

import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.transaction.Transactional;

public interface ContextRepository extends JpaRepository<Context, UUID> {

    List<Context> findByElasticsearchStatus(ElasticsearchStatus status);

    Optional<Context> findByName(String name);

    List<Context> findAllByNameIn(List<String> title);

    @Modifying
    @Transactional
    @Query("update Context set elasticsearchStatus = 'TO_BE_UPDATED' where id in ?1")
    int setSyncForDatasets(List<UUID> datasetIds);

    @Modifying
    @Transactional
    @Query("update Context set elasticsearchStatus = ?2 where id = ?1")
    void updateStatusForDataset(UUID datasetId, ElasticsearchStatus elasticsearchStatus);
}
