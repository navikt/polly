package no.nav.data.polly.policy.rest;

import com.github.tomakehurst.wiremock.http.HttpHeaders;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.policy.rest.PolicyRestController.PolicyPage;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessDistribution;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertFalse;

class PolicyControllerIT extends IntegrationTestBase {

    private static final String POLICY_REST_ENDPOINT = "/policy/";

    @Autowired
    protected TestRestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        processDistributionRepository.deleteAll();
        processRepository.save(Process.builder().purposeCode(PURPOSE_CODE1).id(PROCESS_ID_1).name(PROCESS_NAME_1)
                .data(ProcessData.builder().start(LocalDate.now()).end(LocalDate.now()).build())
                .build());
        processRepository.save(Process.builder().purposeCode(PURPOSE_CODE1).id(PROCESS_ID_2).name(PROCESS_NAME_1 + " 2nd")
                .data(ProcessData.builder().start(LocalDate.now()).end(LocalDate.now()).build())
                .build());
    }

    @Test
    void createPolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getBody(), notNullValue());
        assertThat(policyRepository.count(), is(1L));
        assertPolicy(createEntity.getBody().getContent().get(0), PROCESS_NAME_1);
        assertBehandlingsgrunnlagDistribusjon(1);
    }

    @Test
    void createPolicyThrowNullableValidationException() {
        List<PolicyRequest> requestList = List.of(PolicyRequest.builder().build());
        ResponseEntity<String> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(createEntity.getBody(), containsString("purposeCode was null or missing"));
        assertThat(createEntity.getBody(), containsString("informationTypeId was null or missing"));
        assertThat(createEntity.getBody(), containsString("processId was null or missing"));
        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void createPolicyThrowDuplcateValidationException() {
        InformationType informationType = createAndSaveInformationType();
        List<PolicyRequest> requestList = Arrays.asList(createPolicyRequest(informationType), createPolicyRequest(informationType));
        ResponseEntity<String> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(createEntity.getBody(),
                containsString(
                        "A request combining InformationType: fe566351-da4d-43b0-a2e9-b09e41ff8aa7 and Process: 60db8589-f383-4405-82f1-148b0333899b Purpose: KONTROLL SubjectCategories: [BRUKER]"
                                + " is not unique because it is already used in this request"));
    }

    @Test
    void createPolicyThrowNotFoundValidationException() {
        createPolicyRequest(createAndSaveInformationType());
        List<PolicyRequest> requestList = Collections.singletonList(PolicyRequest.builder().subjectCategory("NOTFOUND").purposeCode("NOTFOUND")
                .processId("17942455-4e86-4315-a7b2-872accd9c856")
                .informationTypeId("b7a86238-c6ca-4e5e-9233-9089d162400c").build());
        ResponseEntity<String> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(createEntity.getBody(), containsString("purposeCode: NOTFOUND code not found in codelist PURPOSE"));
        assertThat(createEntity.getBody(), containsString("An InformationType with id b7a86238-c6ca-4e5e-9233-9089d162400c does not exist"));
        assertThat(createEntity.getBody(), containsString("A Process with id 17942455-4e86-4315-a7b2-872accd9c856 does not exist"));
        assertThat(createEntity.getBody(), containsString("subjectCategories[0]: NOTFOUND code not found in codelist SUBJECT_CATEGORY"));
        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void getOnePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());

        ResponseEntity<PolicyResponse> getEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + createEntity.getBody().getContent().get(0).getId(), HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), PolicyResponse.class);
        assertThat(getEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(getEntity.getBody(), notNullValue());
        assertPolicy(getEntity.getBody(), PROCESS_NAME_1);
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void getNotExistingPolicy() {
        ResponseEntity<PolicyResponse> createEntity = restTemplate
                .exchange(POLICY_REST_ENDPOINT + "1-1-1-1-1", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), PolicyResponse.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    void updateOnePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());
        assertBehandlingsgrunnlagDistribusjon(1);

        PolicyRequest request = requestList.get(0);
        request.setId(createEntity.getBody().getContent().get(0).getId().toString());
        request.setProcessId(PROCESS_ID_2.toString());
        ResponseEntity<PolicyResponse> updateEntity = restTemplate
                .exchange(POLICY_REST_ENDPOINT + createEntity.getBody().getContent().get(0).getId(), HttpMethod.PUT, new HttpEntity<>(request), PolicyResponse.class);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(policyRepository.count(), is(1L));
        assertThat(updateEntity.getBody(), notNullValue());
        assertPolicy(updateEntity.getBody(), PROCESS_NAME_1 + " 2nd");
        assertBehandlingsgrunnlagDistribusjon(2);
    }

    @Test
    void updateOnePolicyThrowValidationExeption() {
        PolicyRequest request = createPolicyRequest(createAndSaveInformationType());
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(List.of(request)), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());

        request.setId(createEntity.getBody().getContent().get(0).getId().toString());
        request.setInformationTypeId(null);
        ResponseEntity<String> updateEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + request.getId(), HttpMethod.PUT, new HttpEntity<>(request), String.class);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(updateEntity.getBody(), containsString("informationTypeId was null or missing"));
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void updateTwoPolices() {
        List<PolicyRequest> requestList = Arrays
                .asList(createPolicyRequest(createAndSaveInformationType()), createPolicyRequest(createAndSaveInformationType(UUID.randomUUID(), "Postadresse")));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());
        assertThat(createEntity.getBody().getTotalElements(), is(2L));
        assertThat(policyRepository.count(), is(2L));

        requestList.forEach(request -> request.setProcessId(PROCESS_ID_2.toString()));
        requestList.get(0).setId(createEntity.getBody().getContent().get(0).getId().toString());
        requestList.get(1).setId(createEntity.getBody().getContent().get(1).getId().toString());

        ResponseEntity<PolicyPage> updateEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.PUT, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(updateEntity.getBody(), notNullValue());
        assertThat(updateEntity.getBody().getTotalElements(), is(2L));
        assertPolicy(updateEntity.getBody().getContent().get(0), PROCESS_NAME_1 + " 2nd");
        assertThat(updateEntity.getBody().getContent().get(1).getProcess().getName(), is(PROCESS_NAME_1 + " 2nd"));
        assertThat(policyRepository.count(), is(2L));
        assertBehandlingsgrunnlagDistribusjon(2);
    }

    @Test
    void updateThreePolicesThrowTwoExceptions() {
        UUID postadressId = UUID.randomUUID();
        List<PolicyRequest> requestList = List.of(
                createPolicyRequest(createAndSaveInformationType()),
                createPolicyRequest(createAndSaveInformationType(postadressId, "Postadresse")),
                createPolicyRequest(createAndSaveInformationType(UUID.randomUUID(), "Arbeidsforhold"))
        );
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());
        assertThat(createEntity.getBody().getTotalElements(), is(3L));

        requestList.get(0).setProcessId(null);
        requestList.get(1).setProcessId(null);
        requestList.get(2).setProcessId(PROCESS_ID_2.toString());
        requestList.get(0).setId(createEntity.getBody().getContent().get(0).getId().toString());
        requestList.get(1).setId(createEntity.getBody().getContent().get(1).getId().toString());
        requestList.get(2).setId(createEntity.getBody().getContent().get(2).getId().toString());

        ResponseEntity<String> updateEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.PUT, new HttpEntity<>(requestList), String.class);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(updateEntity.getBody(), containsString("fe566351-da4d-43b0-a2e9-b09e41ff8aa7/KONTROLL -- fieldIsNullOrMissing -- processId was null or missing"));
        assertThat(updateEntity.getBody(), containsString(postadressId + "/KONTROLL -- fieldIsNullOrMissing -- processId was null or missing"));
        // No error reported regarding Arbeidsforhold/TEST1
        assertFalse(updateEntity.getBody().contains("Arbeidsforhold/TEST1"));
        assertThat(policyRepository.count(), is(3L));
    }

    @Test
    void updateNotExistingPolicy() {
        PolicyRequest request = createPolicyRequest(createAndSaveInformationType());
        request.setId("1-1-1-1-1");
        ResponseEntity<Policy> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "1-1-1-1-1", HttpMethod.PUT, new HttpEntity<>(request), Policy.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    void deletePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());
        assertBehandlingsgrunnlagDistribusjon(1);

        ResponseEntity<String> deleteEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + createEntity.getBody().getContent().get(0).getId(), HttpMethod.DELETE, new HttpEntity<>(new HttpHeaders()), String.class);
        assertThat(deleteEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(policyRepository.count(), is(0L));
        assertBehandlingsgrunnlagDistribusjon(2);
    }

    private void assertBehandlingsgrunnlagDistribusjon(int count) {
        List<ProcessDistribution> all = processDistributionRepository.findAll();
        assertThat(all, hasSize(count));
    }

    @Test
    void deleteNotExistingPolicy() {
        ResponseEntity<String> deleteEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "1-1-1-1-1", HttpMethod.DELETE, new HttpEntity<>(new HttpHeaders()), String.class);
        assertThat(deleteEntity.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    void get20FirstPolicies() {
        createAndSavePolicy(100);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), PolicyPage.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getNumberOfElements(), is(20L));
        assertThat(responseEntity.getBody().getTotalElements(), is(100L));
        assertThat(responseEntity.getBody().getPageSize(), is(20L));
        assertThat(policyRepository.count(), is(100L));
    }

    @Test
    void getManyPolicies() {
        createAndSavePolicy(25);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?pageNumber=0&pageSize=25", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PolicyPage.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getNumberOfElements(), is(25L));
        assertThat(responseEntity.getBody().getTotalElements(), is(25L));
        assertThat(responseEntity.getBody().getPageSize(), is(25L));
        assertThat(policyRepository.count(), is(25L));
    }

    @Test
    void countPolicies() {
        createAndSavePolicy(100);

        ResponseEntity<Long> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "count", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), Long.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), is(100L));
    }

    @Test
    void getPoliciesPageBeyondMax() {
        createAndSavePolicy(100);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?pageNumber=1&pageSize=100", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PolicyPage.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getNumberOfElements(), is(0L));
        assertThat(policyRepository.count(), is(100L));
    }

    @Test
    void getPolicyForProcess() {
        List<Policy> policies = createAndSavePolicy(5);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?processId={id}", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PolicyPage.class, policies.get(0).getProcess().getId());
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getTotalElements(), is(5L));
        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void getPolicyForInformationType1() {
        createAndSavePolicy(5);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?informationTypeId={id}", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PolicyPage.class, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getTotalElements(), is(5L));
        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void countPolicyForInformationType1() {
        createAndSavePolicy(5);

        ResponseEntity<Long> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "count?informationTypeId={id}", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), Long.class, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), is(5L));
    }

    @Test
    void getOnlyActivePoliciesForInformationType() {
        create5PoliciesWith2Inactive();

        ResponseEntity<PolicyPage> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?informationTypeId={id}", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PolicyPage.class, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getTotalElements(), is(3L));
        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void getInactivePoliciesForInformationType() {
        create5PoliciesWith2Inactive();

        ResponseEntity<PolicyPage> responseEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "?informationTypeId={id}&includeInactive=true", HttpMethod.GET, new HttpEntity<>(new HttpHeaders()),
                PolicyPage.class, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getTotalElements(), is(5L));
        assertThat(policyRepository.count(), is(5L));
    }

    private void create5PoliciesWith2Inactive() {
        createAndSavePolicy(5, (i, p) -> {
            p.setInformationTypeName(INFORMATION_TYPE_NAME);
            if (i > 2) {
                p.getData().setStart(LocalDate.now().minusDays(2));
                p.getData().setEnd(LocalDate.now().minusDays(1));
            }
        });
    }

    private PolicyRequest createPolicyRequest(InformationType informationType) {
        return PolicyRequest.builder()
                .subjectCategory("Bruker")
                .processId(PROCESS_ID_1.toString())
                .informationTypeId(informationType.getId().toString())
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("9a").nationalLaw("Ftrl").description("§ 1-4").build()))
                .purposeCode(PURPOSE_CODE1).build();
    }

    private void assertPolicy(PolicyResponse policy, String process) {
        assertThat(policy.getInformationType().getName(), is(INFORMATION_TYPE_NAME));
        assertThat(policy.getProcess().getName(), is(process));
        assertThat(policy.getPurposeCode().getCode(), is(PURPOSE_CODE1));
        assertThat(policy.isLegalBasesInherited(), is(false));
    }
}