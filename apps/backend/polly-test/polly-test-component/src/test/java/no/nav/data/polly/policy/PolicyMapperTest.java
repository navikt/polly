package no.nav.data.polly.policy;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.policy.mapper.PolicyMapper;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class PolicyMapperTest {

    @Mock
    private ProcessRepository processRepository;
    @InjectMocks
    private PolicyMapper mapper;

    private static final String LEGAL_BASIS_DESCRIPTION1 = "Legal basis 1";
    private static final String PURPOSE_CODE1 = "Kontroll";
    private static final String DESC = "Kontrollering";
    private static final String INF_TYPE_NAME_1 = "DatasetTitle 1";
    private static final UUID INF_TYPE_ID_1 = UUID.fromString("cd7f037e-374e-4e68-b705-55b61966b2fc");

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void shouldMapToPolicy() {
        given(processRepository.findByNameAndPurposeCode("process", PURPOSE_CODE1)).willReturn(Optional.of(Process.builder().name("process").build()));
        InformationType informationType = createBasicTestdata();
        PolicyRequest request = PolicyRequest.builder()
                .process("process")
                .subjectCategory("Bruker")
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("6e").nationalLaw("Ftrl").description(LEGAL_BASIS_DESCRIPTION1).build()))
                .start("2019-02-04")
                .end("2020-02-04")
                .purposeCode(PURPOSE_CODE1)
                .informationType(informationType)
                .build();
        Policy policy = mapper.mapRequestToPolicy(request);
        assertThat(policy.getProcess().getName(), is("process"));
        assertThat(policy.getSubjectCategory(), is("Bruker"));
        assertThat(policy.getPurposeCode(), is(PURPOSE_CODE1));
        assertThat(policy.getInformationType(), is(informationType));
        assertThat(policy.getInformationTypeId(), is(informationType.getId()));
        assertThat(policy.getInformationTypeName(), is(informationType.getData().getName()));
        assertThat(policy.getLegalBases().get(0).getDescription(), is(LEGAL_BASIS_DESCRIPTION1));
    }

    @Test
    void shouldMapToPolicyResponse() {
        InformationType informationType = createBasicTestdata();
        Policy policy = createPolicy(informationType);
        PolicyResponse policyResponse = mapper.mapPolicyToResponse(policy);
        assertThat(policyResponse.getInformationType().getId(), is(policy.getInformationTypeId()));
        assertThat(policyResponse.getInformationType().getName(), is(policy.getInformationTypeName()));
        assertThat(policyResponse.getLegalBases().get(0).getDescription(), is(LEGAL_BASIS_DESCRIPTION1));
        assertThat(policyResponse.getPurposeCode(), notNullValue());
        assertThat(policyResponse.getPurposeCode().getCode(), is(PURPOSE_CODE1));
        assertThat(policyResponse.getPurposeCode().getDescription(), is(DESC));
        assertThat(policyResponse.getSubjectCategory().getCode(), is("Bruker"));
    }

    private Policy createPolicy(InformationType informationType) {
        return Policy.builder().id(UUID.randomUUID())
                .process(Process.builder().name("process").build())
                .subjectCategory("Bruker")
                .legalBases(List.of(LegalBasis.builder().gdpr("6e").nationalLaw("nl").description(LEGAL_BASIS_DESCRIPTION1).build()))
                .start(LocalDate.parse("2019-02-04"))
                .end(LocalDate.parse("2020-02-04"))
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
