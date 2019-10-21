package no.nav.polly.policy;

import no.nav.polly.codelist.CodeResponse;
import no.nav.polly.common.exceptions.PollyTechnicalException;
import no.nav.polly.common.rest.RestResponsePage;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.config.HateoasAwareSpringDataWebConfiguration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.UUID;

import static java.util.Arrays.asList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
@Import(HateoasAwareSpringDataWebConfiguration.class)
class PolicyConsumerTest {

    private static final String LEGALBASISDESCRIPTION1 = "Legal basis description 1";
    private static final String LEGALBASISDESCRIPTION2 = "Legal basis description 2";
    private static final String PURPOSECODE1 = "PUR1";
    private static final String PURPOSECODE2 = "PUR2";
    private static final String PURPOSEDESCRIPTION1 = "Purpose description 1";
    private static final String PURPOSEDESCRIPTION2 = "Purpose description 2";
    private static final UUID DATASET_ID_1 = UUID.fromString("acab158d-67ef-4030-a3c2-195e993f18d2");
    private static final ParameterizedTypeReference<RestResponsePage<PolicyResponse>> REST_PAGE_RESPONSE = new ParameterizedTypeReference<>() {
    };

    private static PolicyResponse policyResponse1;
    private static PolicyResponse policyResponse2;

    @MockBean
    private RestTemplate restTemplate = mock(RestTemplate.class);

    @InjectMocks
    private PolicyConsumer policyConsumer;

    @BeforeAll
    static void setUp() {
        policyResponse1 = PolicyResponse.builder()
                .policyId(1L)
                .legalBasisDescription(LEGALBASISDESCRIPTION1)
                .purpose(new CodeResponse(PURPOSECODE1, PURPOSEDESCRIPTION1)).build();
        policyResponse2 = PolicyResponse.builder()
                .policyId(2L)
                .legalBasisDescription(LEGALBASISDESCRIPTION2)
                .purpose(new CodeResponse(PURPOSECODE2, PURPOSEDESCRIPTION2)).build();
    }

    @Test
    void getListOfPolicies() {
        List<PolicyResponse> responseList = asList(policyResponse1, policyResponse2);
        RestResponsePage<PolicyResponse> pagedResources = new RestResponsePage<>(responseList, PageRequest.of(0, responseList.size()), responseList.size());
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), eq(HttpEntity.EMPTY), eq(REST_PAGE_RESPONSE), eq(DATASET_ID_1)))
                .thenReturn(ResponseEntity.ok(pagedResources));
        List<PolicyResponse> policies = policyConsumer.getPolicyForDataset(DATASET_ID_1);
        assertPolicy1(policies.get(0));
        assertPolicy2(policies.get(1));
    }

    @Test
    void policiesNotFound() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), eq(HttpEntity.EMPTY), eq(REST_PAGE_RESPONSE), eq(DATASET_ID_1)))
                .thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));
        List<PolicyResponse> policies = policyConsumer.getPolicyForDataset(DATASET_ID_1);
        assertThat(policies.size()).isEqualTo(0);
    }

    @Test
    void shouldThrowClientException() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), eq(HttpEntity.EMPTY), eq(REST_PAGE_RESPONSE), eq(DATASET_ID_1)))
                .thenThrow(new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
        PollyTechnicalException exception = assertThrows(PollyTechnicalException.class, () -> policyConsumer.getPolicyForDataset(DATASET_ID_1));
        assertThat(exception).hasMessageContaining("Getting Policies for Dataset (id: acab158d-67ef-4030-a3c2-195e993f18d2) failed with status=500 INTERNAL_SERVER_ERROR");
    }

    @Test
    void shouldThrowServerException() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), eq(HttpEntity.EMPTY), eq(REST_PAGE_RESPONSE), eq(DATASET_ID_1)))
                .thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
        PollyTechnicalException exception = assertThrows(PollyTechnicalException.class, () -> policyConsumer.getPolicyForDataset(DATASET_ID_1));
        assertThat(exception).hasMessageContaining("Getting Policies for Dataset (id: acab158d-67ef-4030-a3c2-195e993f18d2) failed with status=500 INTERNAL_SERVER_ERROR");
    }

    private void assertPolicy1(PolicyResponse policy) {
        assertThat(policy.getPolicyId()).isEqualTo(1L);
        assertThat(policy.getPurpose().getCode()).isEqualTo(PURPOSECODE1);
        assertThat(policy.getPurpose().getDescription()).isEqualTo(PURPOSEDESCRIPTION1);
        assertThat(policy.getLegalBasisDescription()).isEqualTo(LEGALBASISDESCRIPTION1);
    }

    private void assertPolicy2(PolicyResponse policy) {
        assertThat(policy.getPolicyId()).isEqualTo(2L);
        assertThat(policy.getPurpose().getCode()).isEqualTo(PURPOSECODE2);
        assertThat(policy.getPurpose().getDescription()).isEqualTo(PURPOSEDESCRIPTION2);
        assertThat(policy.getLegalBasisDescription()).isEqualTo(LEGALBASISDESCRIPTION2);
    }
}
