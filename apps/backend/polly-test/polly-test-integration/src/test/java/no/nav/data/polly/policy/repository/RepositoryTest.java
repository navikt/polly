package no.nav.data.polly.policy.repository;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.legalbasis.LegalBasis;
import no.nav.data.polly.policy.entities.Policy;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

class RepositoryTest extends IntegrationTestBase {

    private static final String LEGAL_BASIS_DESCRIPTION1 = "Legal basis 1";
    private static final String PURPOSE_CODE1 = "PUR1";
    private static final UUID DATASET_ID_1 = UUID.fromString("cd7f037e-374e-4e68-b705-55b61966b2fc");
    private static final UUID DATASET_ID_2 = UUID.fromString("5992e0d0-1fc9-4d67-b825-d198be0827bf");

    @Autowired
    private PolicyRepository policyRepository;

    @BeforeEach
    void setUp() {
        policyRepository.deleteAll();
    }

    @AfterEach
    void cleanup() {
        policyRepository.deleteAll();
    }

    @Test
    void getOne() {
        createTestdata(LEGAL_BASIS_DESCRIPTION1, PURPOSE_CODE1, DATASET_ID_1);
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void getAll() {
        createTestdata(LEGAL_BASIS_DESCRIPTION1, PURPOSE_CODE1, DATASET_ID_1);
        createTestdata("Legal basis 2", "PUR2", UUID.fromString("5992e0d0-1fc9-4d67-b825-d198be0827bf"));
        assertThat(policyRepository.count(), is(2L));
    }

    @Test
    void getByDataset() {
        createTestdata(LEGAL_BASIS_DESCRIPTION1, PURPOSE_CODE1, DATASET_ID_1);
        createTestdata("Legal basis 2", "PUR2", DATASET_ID_2);
        assertThat(policyRepository.findByInformationTypeId(DATASET_ID_1).size(), is(1));
        assertThat(policyRepository.findByInformationTypeId(DATASET_ID_2).size(), is(1));
    }

    @Test
    void countByDataset() {
        createTestdata(LEGAL_BASIS_DESCRIPTION1, PURPOSE_CODE1, DATASET_ID_1);
        createTestdata("Legal basis 2", "PUR2", DATASET_ID_2);
        assertThat(policyRepository.countByInformationTypeId(DATASET_ID_1), is(1L));
        assertThat(policyRepository.countByInformationTypeId(DATASET_ID_2), is(1L));
    }

    private void createTestdata(String legalBasisDescription, String purposeCode, UUID datasetId) {
        Policy policy = new Policy();
//        policy.setDatasetId(datasetId);
        policy.setPurposeCode(purposeCode);
        policy.setLegalBases(List.of(new LegalBasis()));
        policy.setStart(LocalDate.now());
        policy.setEnd(LocalDate.now());
        policyRepository.save(policy);
    }
}
