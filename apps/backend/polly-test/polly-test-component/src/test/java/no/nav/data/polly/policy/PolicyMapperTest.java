package no.nav.data.polly.policy;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.policy.domain.PolicyRequest;
import no.nav.data.polly.policy.domain.PolicyResponse;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.policy.mapper.PolicyMapper;
import no.nav.data.polly.process.Process;
import no.nav.data.polly.process.ProcessRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
        given(processRepository.findByName("process")).willReturn(Optional.of(new Process()));
    }

    @Test
    void shouldMapToPolicy() {
        InformationType informationType = createBasicTestdata();
        PolicyRequest request = PolicyRequest.builder()
                .purposeCode(PURPOSE_CODE1)
                .informationType(informationType).informationTypeName(informationType.getData().getName()).build();
        Policy policy = mapper.mapRequestToPolicy(request);
//        assertThat(policy.getLegalBasisDescription(), is(LEGAL_BASIS_DESCRIPTION1));
        assertThat(policy.getPurposeCode(), is(PURPOSE_CODE1));
        assertThat(policy.getInformationType(), is(informationType));
    }

    @Test
    void shouldMapToPolicyResponse() {
        InformationType informationType = createBasicTestdata();
        Policy policy = createPolicy(informationType);
        PolicyResponse policyResponse = mapper.mapPolicyToResponse(policy);
        assertThat(policyResponse.getInformationType().getId(), is(policy.getInformationTypeId().toString()));
        assertThat(policyResponse.getInformationType().getName(), is(policy.getInformationTypeName()));
//        assertThat(policyResponse.getLegalBasisDescription(), is(LEGAL_BASIS_DESCRIPTION1));
        assertThat(policyResponse.getPurposeCode(), notNullValue());
        assertThat(policyResponse.getPurposeCode().getCode(), is(PURPOSE_CODE1));
        assertThat(policyResponse.getPurposeCode().getDescription(), is(DESC));
    }

    private Policy createPolicy(InformationType informationType) {
        return Policy.builder().id(UUID.randomUUID())
//                .legalBasisDescription(LEGAL_BASIS_DESCRIPTION1)
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
