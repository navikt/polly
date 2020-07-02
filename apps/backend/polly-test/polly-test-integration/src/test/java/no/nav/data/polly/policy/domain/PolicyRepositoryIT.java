package no.nav.data.polly.policy.domain;

import no.nav.data.common.auditing.domain.Action;
import no.nav.data.common.auditing.domain.AuditVersion;
import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.polly.IntegrationTestBase;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class PolicyRepositoryIT extends IntegrationTestBase {

    private static final String PURPOSE_CODE1 = "PUR1";
    private static final String PURPOSE_CODE2 = "PUR2";
    private static final UUID POLICY_ID_1 = UUID.fromString("cd7f037e-374e-4e68-b705-55b61966b2fc");
    private static final UUID POLICY_ID_2 = UUID.fromString("5992e0d0-1fc9-4d67-b825-d198be0827bf");

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private AuditVersionRepository auditVersionRepository;

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
        auditVersionRepository.deleteAll();

        createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        assertThat(policyRepository.count()).isEqualTo(1L);

        Iterable<AuditVersion> audits = auditVersionRepository.findAll();
        var policyAudit = StreamUtils.get(audits, audit -> audit.getTable().equals("POLICY"));
        assertThat(policyAudit).isNotNull();
        assertThat(policyAudit.getAction()).isEqualTo(Action.CREATE);
    }

    @Test
    void getAll() {
        createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        createTestdata(PURPOSE_CODE2, POLICY_ID_2);
        assertThat(policyRepository.count()).isEqualTo(2L);
    }

    @Test
    void getByInformationTypeId() {
        createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        createTestdata(PURPOSE_CODE2, POLICY_ID_2);
        assertThat(policyRepository.findByInformationTypeId(INFORMATION_TYPE_ID_1).size()).isEqualTo(2L);
    }

    @Test
    void countByInformationTypeId() {
        createTestdata(PURPOSE_CODE1, POLICY_ID_1);
        createTestdata(PURPOSE_CODE2, POLICY_ID_2);
        assertThat(policyRepository.countByInformationTypeId(INFORMATION_TYPE_ID_1)).isEqualTo(2L);
    }

    private Policy createTestdata(String purposeCode, UUID datasetId) {
        Policy policy = new Policy.PolicyBuilder()
                .id(datasetId)
                .purposeCode(purposeCode)
                .data(PolicyData.builder()
                        .subjectCategories(List.of("BRUKER"))
                        .legalBasesUse(LegalBasesUse.DEDICATED_LEGAL_BASES)
                        .legalBasis(createLegalBasis())
                        .build())
                .informationType(createAndSaveInformationType())
                .informationTypeId(INFORMATION_TYPE_ID_1)
                .informationTypeName(INFORMATION_TYPE_NAME)
                .process(createAndSaveProcess(purposeCode))
                .build();
        return policyRepository.save(policy);
    }
}