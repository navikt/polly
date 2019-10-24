package no.nav.data.polly.informationtype;

import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import no.nav.data.polly.informationtype.domain.InformationType;
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
    List<InformationType> findAllByName(List<String> title);

    List<InformationType> findByElasticsearchStatus(ElasticsearchStatus status);

    @Modifying
    @Transactional
    @Query("update InformationType set elasticsearchStatus = 'TO_BE_UPDATED' where id in ?1")
    int setSyncForInformationTypeIds(List<UUID> ids);

    @Modifying
    @Transactional
    @Query("update InformationType set elasticsearchStatus = ?2 where id = ?1")
    void updateStatusForDataset(UUID informationTypeId, ElasticsearchStatus elasticsearchStatus);

    @Query(value = "select *  from information_type where information_type_id in (select information_type_id from policy where policy_id in ?1)", nativeQuery = true)
    List<InformationType> findByPolicyIdIn(List<UUID> ids);

}
