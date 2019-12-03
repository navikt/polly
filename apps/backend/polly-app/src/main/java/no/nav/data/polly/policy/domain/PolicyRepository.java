package no.nav.data.polly.policy.domain;

import no.nav.data.polly.process.domain.Process;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import javax.transaction.Transactional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID> {

    List<Policy> findByPurposeCodeAndProcessName(String purposeCode, String processName);

    List<Policy> findByInformationTypeId(UUID informationTypeId);

    List<Policy> findByProcessId(UUID processId);

    List<Policy> findByInformationTypeIdAndPurposeCodeAndSubjectCategoryAndProcessName(UUID informationTypeId, String purposeCode, String subjectCategory, String processName);

    List<Policy> findBySubjectCategory(String subjectCategory);

    @Query(value = "select * from policy where legal_bases->>'gdpr' = ?1", nativeQuery = true)
    List<Policy> findByGDPRArticle(String gdpr);

    @Query(value = "select * from policy where legal_bases->>'nationalLaw' = ?1", nativeQuery = true)
    List<Policy> findByNationalLaw(String nationalLaw);

    long countByInformationTypeId(UUID informationTypeId);

    @Modifying
    @Transactional
    long deleteByInformationTypeId(UUID informationTypeId);

    @Query("select p.informationTypeId from Policy p where p.id in ?1")
    List<UUID> getInformationTypeIdsByIdIn(List<UUID> policyIds);

    @Modifying
    @Transactional
    @Query("update Policy p set p.informationTypeName = ?2 where p.informationTypeId = ?1")
    void updateInformationTypeName(UUID informationTypeId, String name);
}