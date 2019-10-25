package no.nav.data.polly.policy.repository;

import no.nav.data.polly.policy.entities.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import javax.transaction.Transactional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID> {

    List<Policy> findByPurposeCode(String purposeCode);

    @Query("select p from Policy p left join p.informationType it where it.id = ?1")
    List<Policy> findByInformationTypeId(UUID informationTypeId);

    @Query("select p from Policy p left join p.informationType it where it.id = ?1 and p.purposeCode = ?2")
    List<Policy> findByInformationTypeIdAndPurposeCode(UUID informationTypeId, String purposeCode);

    @Query("select count(p) from Policy p left join p.informationType it where it.id = ?1")
    long countByInformationTypeId(UUID informationTypeId);

    @Modifying
    @Transactional
    @Query(value = "delete from POLICY where INFORMATION_TYPE_ID = ?1", nativeQuery = true)
    long deleteByInformationTypeId(UUID informationTypeId);

    @Query("select it.id from Policy p left join p.informationType it where p.id in ?1")
    List<UUID> getInformationTypeIdsByIdIn(List<UUID> policyIds);

}