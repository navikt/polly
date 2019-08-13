package no.nav.data.catalog.backend.app.policy;

import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.policy.PolicyConsumer;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.web.config.HateoasAwareSpringDataWebConfiguration;
import org.springframework.hateoas.PagedResources;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
@ActiveProfiles("test")
@Import(HateoasAwareSpringDataWebConfiguration.class)
public class PolicyConsumerTest {
    private static final String LEGALBASISDESCRIPTION1 = "Legal basis description 1";
    private static final String LEGALBASISDESCRIPTION2 = "Legal basis description 2";
    private static final String PURPOSECODE1 = "PUR1";
    private static final String PURPOSECODE2 = "PUR2";
    private static final String PURPOSEDESCRIPTION1 = "Purpose description 1";
    private static final String PURPOSEDESCRIPTION2 = "Purpose description 2";


    private static PolicyResponse policyResponse1;
    private static PolicyResponse policyResponse2;

    @MockBean
    private RestTemplate restTemplate = mock(RestTemplate.class);

    @InjectMocks
    private PolicyConsumer policyConsumer;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @BeforeClass
    public static void setUp() {
        policyResponse1 = PolicyResponse.builder()
                .policyId(1L)
                .informationType(new InformationType())
                .legalBasisDescription(LEGALBASISDESCRIPTION1)
                .purpose(Map.of("code", PURPOSECODE1, "description", PURPOSEDESCRIPTION1)).build();
        policyResponse2 = PolicyResponse.builder()
                .policyId(2L)
                .informationType(new InformationType())
                .legalBasisDescription(LEGALBASISDESCRIPTION2)
                .purpose(Map.of("code", PURPOSECODE2, "description", PURPOSEDESCRIPTION2)).build();
    }

    @Test
    public void getListOfPolicies() {
        List<PolicyResponse> responseList = Arrays.asList(policyResponse1, policyResponse2);
        PagedResources<PolicyResponse> pagedResources = new PagedResources<>(responseList,
                new PagedResources.PageMetadata(responseList.size(), 1, responseList.size(), 1));
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), eq(HttpEntity.EMPTY), eq(new ParameterizedTypeReference<PagedResources<PolicyResponse>>() {}))).thenReturn(ResponseEntity.ok(pagedResources));
        List<PolicyResponse> policies = policyConsumer.getPolicyForInformationType(1L);
        assertPolicy1(policies.get(0));
        assertPolicy2(policies.get(1));
    }

    @Test
    public void policiesNotFound() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), eq(HttpEntity.EMPTY), eq(new ParameterizedTypeReference<PagedResources<PolicyResponse>>() {}))).thenThrow(new HttpClientErrorException(HttpStatus.NOT_FOUND));
        List<PolicyResponse> policies = policyConsumer.getPolicyForInformationType(1L);
        assertThat(policies.size(), is(0));
    }

    @Test
    public void shouldThrowClientException() {
        expectedException.expect(DataCatalogBackendTechnicalException.class);
        expectedException.expectMessage("Getting Policies for InformationType (id: 1) failed with status=500 INTERNAL_SERVER_ERROR");
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), eq(HttpEntity.EMPTY), eq(new ParameterizedTypeReference<PagedResources<PolicyResponse>>() {}))).thenThrow(new HttpClientErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
        policyConsumer.getPolicyForInformationType(1L);
    }

    @Test
    public void shouldThrowServerException() {
        expectedException.expect(DataCatalogBackendTechnicalException.class);
        expectedException.expectMessage("Getting Policies for InformationType (id: 1) failed with status=500 INTERNAL_SERVER_ERROR");
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), eq(HttpEntity.EMPTY), eq(new ParameterizedTypeReference<PagedResources<PolicyResponse>>() {}))).thenThrow(new HttpServerErrorException(HttpStatus.INTERNAL_SERVER_ERROR));
        policyConsumer.getPolicyForInformationType(1L);
    }

    private void assertPolicy1(PolicyResponse policy) {
        assertThat(policy.getPolicyId(), is(1L));
        assertThat(policy.getPurpose().get("code"), is(PURPOSECODE1));
        assertThat(policy.getPurpose().get("description"), is(PURPOSEDESCRIPTION1));
        assertThat(policy.getLegalBasisDescription(), is(LEGALBASISDESCRIPTION1));
    }

    private void assertPolicy2(PolicyResponse policy) {
        assertThat(policy.getPolicyId(), is(2L));
        assertThat(policy.getPurpose().get("code"), is(PURPOSECODE2));
        assertThat(policy.getPurpose().get("description"), is(PURPOSEDESCRIPTION2));
        assertThat(policy.getLegalBasisDescription(), is(LEGALBASISDESCRIPTION2));
    }
}
