package no.nav.data.polly.policy.repository;

import no.nav.data.polly.policy.entities.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import javax.transaction.Transactional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    List<Policy> findByDatasetId(String datasetId);

    /**
     * For some reason deleteBy methods are not transactional by default
     */
    @Transactional
    long deleteByDatasetId(String datasetId);

    long countByDatasetId(String datasetId);

    List<Policy> findByDatasetIdAndPurposeCode(String datasetId, String purposeCode);

    List<Policy> findByPurposeCode(String purposeCode);

}