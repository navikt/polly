package no.nav.data.polly.policy.repository;

import no.nav.data.polly.policy.entities.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import javax.transaction.Transactional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID> {

    List<Policy> findByInformationTypeId(UUID informationTypeId);

    /**
     * For some reason deleteBy methods are not transactional by default
     */
    @Transactional
    long deleteByInformationTypeId(UUID informationTypeId);

    long countByInformationTypeId(UUID informationTypeId);

    List<Policy> findByInformationTypeIdAndPurposeCode(UUID informationTypeId, String purposeCode);

    List<Policy> findByPurposeCode(String purposeCode);

}