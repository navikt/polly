package no.nav.data.polly.policy.domain;

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

    List<Policy> findByInformationTypeIdAndPurposeCodeAndSubjectCategoryAndProcessName(UUID informationTypeId, String purposeCode, String subjectCategory, String processName);

    long countByInformationTypeId(UUID informationTypeId);

    @Modifying
    @Transactional
    long deleteByInformationTypeId(UUID informationTypeId);

    @Query("select p.informationTypeId from Policy p where p.id in ?1")
    List<UUID> getInformationTypeIdsByIdIn(List<UUID> policyIds);

}