package no.nav.data.polly.policy.rest;

import com.github.tomakehurst.wiremock.http.HttpHeaders;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.behandlingsgrunnlag.domain.BehandlingsgrunnlagDistribution;
import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.domain.PolicyRequest;
import no.nav.data.polly.policy.domain.PolicyResponse;
import no.nav.data.polly.policy.entities.Policy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertFalse;

class PolicyControllerIT extends IntegrationTestBase {

    private static final String POLICY_REST_ENDPOINT = "/policy/";

    private static final ParameterizedTypeReference<List<PolicyResponse>> POLICY_LIST_RESPONSE = new ParameterizedTypeReference<>() {
    };
    private static final ParameterizedTypeReference<RestResponsePage<PolicyResponse>> PAGE_RESPONSE = new ParameterizedTypeReference<>() {
    };

    @Autowired
    protected TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        behandlingsgrunnlagDistributionRepository.deleteAll();
    }

    @Test
    void createPolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createInformationType()));
        ResponseEntity<List<PolicyResponse>> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), POLICY_LIST_RESPONSE);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(policyRepository.count(), is(1L));
        assertPolicy(createEntity.getBody().get(0), LEGAL_BASIS_DESCRIPTION1);
        assertBehandlingsgrunnlagDistribusjon(1);
    }

    @Test
    void createPolicyThrowNullableValidationException() {
        List<PolicyRequest> requestList = List.of(PolicyRequest.builder().build());
        ResponseEntity<String> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(createEntity.getBody(), containsString("purposeCode cannot be null"));
        assertThat(createEntity.getBody(), containsString("informationTypeTitle cannot be null"));
        assertThat(createEntity.getBody(), containsString("legalBasisDescription cannot be null"));
        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void createPolicyThrowAlreadyExistsValidationException() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createInformationType()));
        ResponseEntity<String> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(policyRepository.count(), is(1L));

        createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);

        assertThat(createEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(createEntity.getBody(), containsString("A policy combining InformationType " + INFORMATION_TYPE_NAME + " and Purpose " + PURPOSE_CODE1 + " already exists"));
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void createPolicyThrowDuplcateValidationException() {
        InformationType informationType = createInformationType();
        List<PolicyRequest> requestList = Arrays.asList(createPolicyRequest(informationType), createPolicyRequest(informationType));
        ResponseEntity<String> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(createEntity.getBody(),
                containsString("A request combining InformationType: " + INFORMATION_TYPE_NAME + " and Purpose: " + PURPOSE_CODE1
                        + " is not unique because it is already used in this request"));
    }

    @Test
    void createPolicyThrowNotFoundValidationException() {
        createPolicyRequest(createInformationType());
        List<PolicyRequest> requestList = Arrays
                .asList(PolicyRequest.builder().purposeCode("NOTFOUND").informationTypeName("NOTFOUND").legalBasisDescription(LEGAL_BASIS_DESCRIPTION1).build());
        ResponseEntity<String> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(createEntity.getBody(), containsString("The purposeCode NOTFOUND was not found in the PURPOSE codelist"));
        assertThat(createEntity.getBody(), containsString("An informationType with name NOTFOUND does not exist"));
        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void getOnePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createInformationType()));
        ResponseEntity<List<PolicyResponse>> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), POLICY_LIST_RESPONSE);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));

        ResponseEntity<PolicyResponse> getEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + createEntity.getBody().get(0).getPolicyId(), HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), PolicyResponse.class);
        assertThat(getEntity.getStatusCode(), is(HttpStatus.OK));
        assertPolicy(getEntity.getBody(), LEGAL_BASIS_DESCRIPTION1);
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void getNotExistingPolicy() {
        ResponseEntity<PolicyResponse> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT + "-1", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), PolicyResponse.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    void updateOnePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createInformationType()));
        ResponseEntity<List<PolicyResponse>> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), POLICY_LIST_RESPONSE);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertBehandlingsgrunnlagDistribusjon(1);

        PolicyRequest request = requestList.get(0);
        request.setId(createEntity.getBody().get(0).getPolicyId().toString());
        request.setLegalBasisDescription("UPDATED");
        ResponseEntity<PolicyResponse> updateEntity = restTemplate
                .exchange(POLICY_REST_ENDPOINT + createEntity.getBody().get(0).getPolicyId(), HttpMethod.PUT, new HttpEntity<>(request), PolicyResponse.class);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(policyRepository.count(), is(1L));
        assertPolicy(updateEntity.getBody(), "UPDATED");
        assertBehandlingsgrunnlagDistribusjon(2);
    }

    @Test
    void updateOnePolicyThrowValidationExeption() {
        PolicyRequest request = createPolicyRequest(createInformationType());
        ResponseEntity<List<PolicyResponse>> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(List.of(request)), POLICY_LIST_RESPONSE);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));

        request.setId(createEntity.getBody().get(0).getPolicyId().toString());
        request.setLegalBasisDescription(null);
        ResponseEntity<String> updateEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + request.getId(), HttpMethod.PUT, new HttpEntity<>(request), String.class);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(updateEntity.getBody(), containsString("legalBasisDescription cannot be null"));
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void updateTwoPolices() {
        List<PolicyRequest> requestList = Arrays
                .asList(createPolicyRequest(createInformationType()), createPolicyRequest(createInformationType(UUID.randomUUID(), "Postadresse")));
        ResponseEntity<List<PolicyResponse>> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), POLICY_LIST_RESPONSE);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody().size(), is(2));
        assertThat(policyRepository.count(), is(2L));

        requestList.forEach(request -> request.setLegalBasisDescription("UPDATED"));
        requestList.get(0).setId(createEntity.getBody().get(0).getPolicyId().toString());
        requestList.get(1).setId(createEntity.getBody().get(1).getPolicyId().toString());

        ResponseEntity<List<PolicyResponse>> updateEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.PUT, new HttpEntity<>(requestList), POLICY_LIST_RESPONSE);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(updateEntity.getBody().size(), is(2));
        assertPolicy(updateEntity.getBody().get(0), "UPDATED");
        assertThat(updateEntity.getBody().get(1).getLegalBasisDescription(), is("UPDATED"));
        assertThat(policyRepository.count(), is(2L));
        assertBehandlingsgrunnlagDistribusjon(2);
    }

    @Test
    void updateThreePolicesThrowTwoExceptions() {
        List<PolicyRequest> requestList = List.of(
                createPolicyRequest(createInformationType()),
                createPolicyRequest(createInformationType(UUID.randomUUID(), "Postadresse")),
                createPolicyRequest(createInformationType(UUID.randomUUID(), "Arbeidsforhold"))
        );
        ResponseEntity<List<PolicyResponse>> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), POLICY_LIST_RESPONSE);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody().size(), is(3));

        requestList.get(0).setLegalBasisDescription(null);
        requestList.get(1).setLegalBasisDescription(null);
        requestList.get(2).setLegalBasisDescription("UPDATED");
        requestList.get(0).setId(createEntity.getBody().get(0).getPolicyId().toString());
        requestList.get(1).setId(createEntity.getBody().get(1).getPolicyId().toString());
        requestList.get(2).setId(createEntity.getBody().get(2).getPolicyId().toString());

        ResponseEntity<String> updateEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.PUT, new HttpEntity<>(requestList), String.class);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(updateEntity.getBody(), containsString("Sivilstand/Kontroll -- legalBasisDescription -- legalBasisDescription cannot be null"));
        assertThat(updateEntity.getBody(), containsString("Postadresse/Kontroll -- legalBasisDescription -- legalBasisDescription cannot be null"));
        // No error reported regarding Arbeidsforhold/TEST1
        assertFalse(updateEntity.getBody().contains("Arbeidsforhold/TEST1"));
        assertThat(policyRepository.count(), is(3L));
    }

    @Test
    void updateNotExistingPolicy() {
        PolicyRequest request = createPolicyRequest(createInformationType());
        ResponseEntity<Policy> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "-1", HttpMethod.PUT, new HttpEntity<>(request), Policy.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    void deletePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createInformationType()));
        ResponseEntity<List<PolicyResponse>> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), POLICY_LIST_RESPONSE);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertBehandlingsgrunnlagDistribusjon(1);

        ResponseEntity<String> deleteEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + createEntity.getBody().get(0).getPolicyId(), HttpMethod.DELETE, new HttpEntity<>(new HttpHeaders()), String.class);
        assertThat(deleteEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(policyRepository.count(), is(0L));
        assertBehandlingsgrunnlagDistribusjon(2);
    }

    private void assertBehandlingsgrunnlagDistribusjon(int count) {
        List<BehandlingsgrunnlagDistribution> all = behandlingsgrunnlagDistributionRepository.findAll();
        assertThat(all, hasSize(count));
        assertThat(all.get(0).getPurpose(), is(PURPOSE_CODE1));
    }

    @Test
    public void deletePoliciesByInformationTypeId() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createInformationType()));
        ResponseEntity<List<PolicyResponse>> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), POLICY_LIST_RESPONSE);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));

        URI uri = UriComponentsBuilder.fromPath(POLICY_REST_ENDPOINT).queryParam("informationTypeId", INFORMATION_TYPE_ID_1).build().toUri();
        ResponseEntity deleteEntity = restTemplate.exchange(uri, HttpMethod.DELETE, new HttpEntity<>(null), Void.class);
        assertThat(deleteEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void deleteNotExistingPolicy() {
        ResponseEntity<String> deleteEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "-1", HttpMethod.DELETE, new HttpEntity<>(new HttpHeaders()), String.class);
        assertThat(deleteEntity.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }


    @Test
    void get20FirstPolicies() {
        createPolicy(100);

        ResponseEntity<RestResponsePage<PolicyResponse>> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), PAGE_RESPONSE);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody().getContent().size(), is(20));
        assertThat(responseEntity.getBody().getTotalElements(), is(100L));
        assertThat(responseEntity.getBody().getPageSize(), is(20L));
        assertThat(policyRepository.count(), is(100L));
    }

    @Test
    void get100Policies() {
        createPolicy(100);

        ResponseEntity<RestResponsePage<PolicyResponse>> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?pageNumber=0&pageSize=100", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PAGE_RESPONSE);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody().getContent().size(), is(100));
        assertThat(responseEntity.getBody().getTotalElements(), is(100L));
        assertThat(responseEntity.getBody().getPageSize(), is(100L));
        assertThat(policyRepository.count(), is(100L));
    }

    @Test
    void countPolicies() {
        createPolicy(100);

        ResponseEntity<Long> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "count", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), Long.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), is(100L));
    }

    @Test
    void getPoliciesPageBeyondMax() {
        createPolicy(100);

        ResponseEntity<RestResponsePage<PolicyResponse>> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?pageNumber=1&pageSize=100", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PAGE_RESPONSE);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody().getContent().size(), is(0));
        assertThat(policyRepository.count(), is(100L));
    }

    @Test
    void getPolicyForInformationType1() {
        createPolicy(5);

        ResponseEntity<RestResponsePage<PolicyResponse>> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?informationTypeId={id}", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PAGE_RESPONSE, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody().getContent().size(), is(1));
        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void countPolicyForInformationType1() {
        createPolicy(5);

        ResponseEntity<Long> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "count?informationTypeId={id}", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), Long.class, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), is(1L));
    }

    @Test
    void getOnlyActivePoliciesForInformationType() {
        create5PoliciesWith2Inactive();

        ResponseEntity<RestResponsePage<PolicyResponse>> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?informationTypeId={id}", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PAGE_RESPONSE, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody().getContent().size(), is(3));
        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void getInactivePoliciesForInformationType() {
        create5PoliciesWith2Inactive();

        ResponseEntity<RestResponsePage<PolicyResponse>> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?informationTypeId={id}&includeInactive=true", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PAGE_RESPONSE, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody().getContent().size(), is(5));
        assertThat(policyRepository.count(), is(5L));
    }

    private void create5PoliciesWith2Inactive() {
        createPolicy(5, (i, p) -> {
//            p.setInformationTypeId(INFORMATION_TYPE_ID_1.toString());
            p.setInformationTypeName(INFORMATION_TYPE_NAME);
            if (i > 3) {
                p.setStart(LocalDate.now().minusDays(2));
                p.setEnd(LocalDate.now().minusDays(1));
            }
        });
    }

    private PolicyRequest createPolicyRequest(InformationType informationType) {
        return PolicyRequest.builder().informationTypeName(informationType.getData().getName()).legalBasisDescription(LEGAL_BASIS_DESCRIPTION1)
                .purposeCode(PURPOSE_CODE1).build();
    }

    private void assertPolicy(PolicyResponse policy, String legalBasisDescription) {
        assertThat(policy.getInformationType().getName(), is(INFORMATION_TYPE_NAME));
        assertThat(policy.getLegalBasisDescription(), is(legalBasisDescription));
        assertThat(policy.getPurpose().getCode(), is(PURPOSE_CODE1));
    }
}