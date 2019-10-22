package no.nav.data.polly.policy;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.policy.domain.DatasetResponse;
import no.nav.data.polly.policy.domain.PolicyRequest;
import no.nav.data.polly.policy.domain.PolicyResponse;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.policy.mapper.PolicyMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;


class PolicyMapperTest {

    private PolicyMapper mapper = new PolicyMapper();

    private static final String LEGAL_BASIS_DESCRIPTION1 = "Legal basis 1";
    private static final String PURPOSE_CODE1 = "Kontroll";
    private static final String DESC = "Kontrollering";
    private static final String DATASET_TITLE_1 = "DatasetTitle 1";
    private static final String DATASET_ID_1 = "cd7f037e-374e-4e68-b705-55b61966b2fc";

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void shouldMapToPolicy() {
        DatasetResponse dataset = createBasicTestdata();
        PolicyRequest request = PolicyRequest.builder()
                .legalBasisDescription(LEGAL_BASIS_DESCRIPTION1).purposeCode(PURPOSE_CODE1)
                .datasetId(dataset.getId()).datasetTitle(dataset.getTitle()).build();
        Policy policy = mapper.mapRequestToPolicy(request, null);
        assertThat(policy.getLegalBasisDescription(), is(LEGAL_BASIS_DESCRIPTION1));
        assertThat(policy.getPurposeCode(), is(PURPOSE_CODE1));
        assertThat(policy.getDatasetId(), is(dataset.getId()));
        assertThat(policy.getDatasetTitle(), is(dataset.getTitle()));
    }

    @Test
    void shouldMapToPolicyResponse() {
        DatasetResponse dataset = createBasicTestdata();
        Policy policy = createPolicy(dataset);
        PolicyResponse policyResponse = mapper.mapPolicyToResponse(policy);
        assertThat(policyResponse.getDataset().getId(), is(policy.getDatasetId()));
        assertThat(policyResponse.getDataset().getTitle(), is(policy.getDatasetTitle()));
        assertThat(policyResponse.getLegalBasisDescription(), is(LEGAL_BASIS_DESCRIPTION1));
        assertThat(policyResponse.getPurpose(), notNullValue());
        assertThat(policyResponse.getPurpose().getCode(), is(PURPOSE_CODE1));
        assertThat(policyResponse.getPurpose().getDescription(), is(DESC));
    }

    private Policy createPolicy(DatasetResponse dataset) {
        return Policy.builder().id(1L)
                .legalBasisDescription(LEGAL_BASIS_DESCRIPTION1).purposeCode(PURPOSE_CODE1)
                .datasetTitle(dataset.getTitle()).datasetId(dataset.getId())
                .build();
    }

    private DatasetResponse createBasicTestdata() {
        return DatasetResponse.builder()
                .id(DATASET_ID_1)
                .title(DATASET_TITLE_1)
                .build();
    }
}
