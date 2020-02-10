package no.nav.data.polly.policy;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyData;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.policy.mapper.PolicyMapper;
import no.nav.data.polly.process.domain.Process;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;

class PolicyMapperTest {

    private PolicyMapper mapper = new PolicyMapper();

    private static final String LEGAL_BASIS_DESCRIPTION1 = "Legal basis 1";
    private static final String PURPOSE_CODE1 = "KONTROLL";
    private static final String DESC = "Kontrollering";
    private static final String INF_TYPE_NAME_1 = "DatasetTitle 1";
    private static final UUID INF_TYPE_ID_1 = UUID.fromString("cd7f037e-374e-4e68-b705-55b61966b2fc");

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void shouldMapToPolicy() {
        InformationType informationType = createBasicTestdata();
        PolicyRequest request = PolicyRequest.builder()
                .process(Process.builder().name("process").build())
                .subjectCategories(List.of("Bruker"))
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("6e").nationalLaw("Ftrl").description(LEGAL_BASIS_DESCRIPTION1).build()))
                .start("2019-02-04")
                .end("2020-02-04")
                .purposeCode(PURPOSE_CODE1)
                .informationType(informationType)
                .build();
        Policy policy = mapper.mapRequestToPolicy(request);
        assertThat(policy.getProcess().getName(), is("process"));
        assertThat(policy.getData().getSubjectCategories(), hasItem("Bruker"));
        assertThat(policy.getPurposeCode(), is(PURPOSE_CODE1));
        assertThat(policy.getInformationType(), is(informationType));
        assertThat(policy.getInformationTypeId(), is(informationType.getId()));
        assertThat(policy.getInformationTypeName(), is(informationType.getData().getName()));
        assertThat(policy.getData().getLegalBases().get(0).getDescription(), is(LEGAL_BASIS_DESCRIPTION1));
    }

    @Test
    void shouldMapToPolicyResponse() {
        InformationType informationType = createBasicTestdata();
        Policy policy = createPolicy(informationType);
        PolicyResponse policyResponse = policy.convertToResponse(true);
        assertThat(policyResponse.getInformationType().getId(), is(policy.getInformationTypeId()));
        assertThat(policyResponse.getInformationType().getName(), is(policy.getInformationTypeName()));
        assertThat(policyResponse.getLegalBases().get(0).getDescription(), is(LEGAL_BASIS_DESCRIPTION1));
        assertThat(policyResponse.getPurposeCode(), notNullValue());
        assertThat(policyResponse.getPurposeCode().getCode(), is(PURPOSE_CODE1));
        assertThat(policyResponse.getPurposeCode().getDescription(), is(DESC));
        assertThat(policyResponse.getSubjectCategories().get(0).getCode(), is("Bruker"));
    }

    private Policy createPolicy(InformationType informationType) {
        return Policy.builder().id(UUID.randomUUID())
                .process(Process.builder().name("process").build())
                .data(PolicyData.builder()
                        .subjectCategories(List.of("Bruker"))
                        .legalBases(List.of(LegalBasis.builder().gdpr("6e").nationalLaw("nl").description(LEGAL_BASIS_DESCRIPTION1).build()))
                        .start(LocalDate.parse("2019-02-04"))
                        .end(LocalDate.parse("2020-02-04"))
                        .build())
                .purposeCode(PURPOSE_CODE1)
                .informationType(informationType)
                .build();
    }

    private InformationType createBasicTestdata() {
        return InformationType.builder()
                .id(INF_TYPE_ID_1)
                .data(InformationTypeData.builder().name(INF_TYPE_NAME_1).build())
                .build();
    }
}
