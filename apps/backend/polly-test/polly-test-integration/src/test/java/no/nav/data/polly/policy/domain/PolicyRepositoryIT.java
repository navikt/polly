package no.nav.data.polly.policy.domain;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.IsEqual.equalToObject;

class PolicyRepositoryIT extends IntegrationTestBase {

    private static final String PURPOSE_CODE1 = "PUR1";
    private static final String PURPOSE_CODE2 = "PUR2";
    private static final UUID POLICY_ID_1 = UUID.fromString("cd7f037e-374e-4e68-b705-55b61966b2fc");
    private static final UUID POLICY_ID_2 = UUID.fromString("5992e0d0-1fc9-4d67-b825-d198be0827bf");

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
        createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void getAll() {
        createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        createTestdata(PURPOSE_CODE2, POLICY_ID_2);
        assertThat(policyRepository.count(), is(2L));
    }

    @Test
    void getByInformationTypeId() {
        createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        createTestdata(PURPOSE_CODE2, POLICY_ID_2);
        assertThat(policyRepository.findByInformationTypeId(INFORMATION_TYPE_ID_1).size(), is(2));
    }

    @Test
    void countByInformationTypeId() {
        createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        createTestdata(PURPOSE_CODE2, POLICY_ID_2);
        assertThat(policyRepository.countByInformationTypeId(INFORMATION_TYPE_ID_1), is(2L));
    }

    @Test
    void findByPurposeCodeAndProcessName() {
        Policy expectedPolicy = createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        createTestdata(PURPOSE_CODE2, POLICY_ID_2);
        assertThat(policyRepository.findByPurposeCodeAndProcessName(PURPOSE_CODE1, "Auto_" + PURPOSE_CODE1).get(0), equalToObject(expectedPolicy));
    }

    private Policy createTestdata(String purposeCode, UUID datasetId) {
        Policy policy = new Policy.PolicyBuilder()
                .id(datasetId)
                .purposeCode(purposeCode)
                .subjectCategory("BRUKER")
                .activeToday()
                .legalBasesInherited(false)
                .legalBasis(createLegalBasis())
                .informationType(createInformationType())
                .informationTypeId(INFORMATION_TYPE_ID_1)
                .informationTypeName(INFORMATION_TYPE_NAME)
                .process(createAndSaveProcess(purposeCode))
                .build();
        return policyRepository.save(policy);
    }
}