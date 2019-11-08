package no.nav.data.polly.informationtype;

import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.TermCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.transaction.Transactional;

public interface InformationTypeRepository extends JpaRepository<InformationType, UUID> {

    @Query(value = "select * from information_type where data ->>'name' = ?1", nativeQuery = true)
    Optional<InformationType> findByName(String name);

    @Query(value = "select * from information_type where data ->>'name' in (?1)", nativeQuery = true)
    List<InformationType> findAllByNameIn(List<String> names);

    @Query(value = "select * from information_type where data ->>'name' ilike %?1%", nativeQuery = true)
    List<InformationType> findByNameLike(String name);

    List<InformationType> findByElasticsearchStatus(ElasticsearchStatus status);

    @Modifying
    @Transactional
    @Query("update InformationType set elasticsearchStatus = 'TO_BE_UPDATED' where id in ?1")
    int setSyncForInformationTypeIds(List<UUID> ids);

    @Modifying
    @Transactional
    @Query("update InformationType set elasticsearchStatus = ?2 where id = ?1")
    void updateStatusForInformationType(UUID informationTypeId, ElasticsearchStatus elasticsearchStatus);

    List<InformationType> findByTermName(String term);

    @Query(value = "select t.name as term, count(it) as count from InformationType it join it.term t group by t.name")
    List<TermCount> countByTerm();
}
