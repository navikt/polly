package no.nav.data.polly.policy.rest;

import com.github.tomakehurst.wiremock.http.HttpHeaders;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.policy.rest.PolicyRestController.PolicyPage;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
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

    private static final String POLICY_REST_ENDPOINT = "/policy";

    @Autowired
    protected TestRestTemplate restTemplate;
    
    @BeforeEach
    void setUp() {
        processRepository.save(Process.builder().id(PROCESS_ID_1)
                .data(ProcessData.builder().purpose(PURPOSE_CODE1).name(PROCESS_NAME_1).start(LocalDate.now()).end(LocalDate.now()).build())
                .build());
        processRepository.save(Process.builder().id(PROCESS_ID_2)
                .data(ProcessData.builder().purpose(PURPOSE_CODE1).name(PROCESS_NAME_1 + " 2nd").start(LocalDate.now()).end(LocalDate.now()).build())
                .build());
    }

    @Test
    void createPolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getBody(), notNullValue());
        assertThat(policyRepository.count(), is(1L));
        assertPolicy(createEntity.getBody().getContent().get(0), PROCESS_NAME_1, INFORMATION_TYPE_NAME);
    }

    @Test
    void createPolicyThrowNullableValidationException() {
        List<PolicyRequest> requestList = List.of(PolicyRequest.builder().build());

        var resp = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);

        assertThat(resp.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(resp.getBody(), containsString("purposes was null or missing"));
        assertThat(resp.getBody(), containsString("informationTypeId was null or missing"));
        assertThat(resp.getBody(), containsString("processId was null or missing"));
        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void createPolicyThrowDuplicateValidationException() {
        InformationType informationType = createAndSaveInformationType();
        List<PolicyRequest> requestList = Arrays.asList(createPolicyRequest(informationType), createPolicyRequest(informationType));

        var resp = restTemplate.exchange(
                    POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);

        assertThat(resp.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(resp.getBody(),
                containsString(
                        "[InformationType: fe566351-da4d-43b0-a2e9-b09e41ff8aa7 Process: 60db8589-f383-4405-82f1-148b0333899b SubjectCategory: BRUKER] is not unique because it is already used in this request (see request nr: 1 and 2)"));
    }

    @Test
    void createPolicyThrowDuplicateOnProcessValidationException() {
        InformationType informationType = createAndSaveInformationType();
        ResponseEntity<String> createEntity = restTemplate
                .exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(List.of(createPolicyRequest(informationType))), String.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));

        var resp = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(List.of(createPolicyRequest(informationType))), String.class);

        assertThat(resp.getBody(), containsString(
                "[InformationType: fe566351-da4d-43b0-a2e9-b09e41ff8aa7 Process: 60db8589-f383-4405-82f1-148b0333899b SubjectCategory: BRUKER] is not unique because it is already used in this process (see request nr: 1)"));
    }

    @Test
    void createPolicyThrowNotFoundValidationException() {
        createPolicyRequest(createAndSaveInformationType());
        List<PolicyRequest> requestList = Collections.singletonList(PolicyRequest.builder().subjectCategory("NOTFOUND").purpose("NOTFOUND")
                .processId("17942455-4e86-4315-a7b2-872accd9c856")
                .informationTypeId("b7a86238-c6ca-4e5e-9233-9089d162400c").build());

        var resp = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), String.class);

        assertThat(resp.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(resp.getBody(), containsString("purposes[0]: NOTFOUND code not found in codelist PURPOSE"));
        assertThat(resp.getBody(), containsString("An InformationType with id b7a86238-c6ca-4e5e-9233-9089d162400c does not exist"));
        assertThat(resp.getBody(), containsString("A Process with id 17942455-4e86-4315-a7b2-872accd9c856 does not exist"));
        assertThat(resp.getBody(), containsString("subjectCategories[0]: NOTFOUND code not found in codelist SUBJECT_CATEGORY"));
        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void getOnePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());

        ResponseEntity<PolicyResponse> getEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT + "/" + createEntity.getBody().getContent().get(0).getId(),
                PolicyResponse.class);
        assertThat(getEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(getEntity.getBody(), notNullValue());
        assertPolicy(getEntity.getBody(), PROCESS_NAME_1, INFORMATION_TYPE_NAME);
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void getNotExistingPolicy() {

        var resp = restTemplate.getForEntity(POLICY_REST_ENDPOINT + "/1-1-1-1-1",
                    PolicyResponse.class);

        assertThat(resp.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    void updateOnePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());

        PolicyRequest request = requestList.get(0);
        request.setId(createEntity.getBody().getContent().get(0).getId().toString());
        request.setProcessId(PROCESS_ID_2.toString());
        var newInfoType = createAndSaveInformationType(UUID.randomUUID(), "newname");
        request.setInformationTypeId(newInfoType.getId().toString());

        ResponseEntity<PolicyResponse> updateEntity = restTemplate
                .exchange(POLICY_REST_ENDPOINT + "/" + createEntity.getBody().getContent().get(0).getId(), HttpMethod.PUT, new HttpEntity<>(request), PolicyResponse.class);
        assertThat(updateEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(policyRepository.count(), is(1L));
        assertThat(updateEntity.getBody(), notNullValue());
        assertPolicy(updateEntity.getBody(), PROCESS_NAME_1 + " 2nd", newInfoType.getData().getName());
        assertThat(policyRepository.findByInformationTypeId(newInfoType.getId()), hasSize(1));
    }

    @Test
    void updateOnePolicyThrowValidationExeption() {
        PolicyRequest request = createPolicyRequest(createAndSaveInformationType());
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(List.of(request)), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());

        request.setId(createEntity.getBody().getContent().get(0).getId().toString());
        request.setInformationTypeId(null);

        var resp = restTemplate.exchange(
                    POLICY_REST_ENDPOINT + "/" + request.getId(), HttpMethod.PUT, new HttpEntity<>(request), String.class);

        assertThat(resp.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(resp.getBody(), containsString("informationTypeId was null or missing"));
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
        assertPolicy(updateEntity.getBody().getContent().get(0), PROCESS_NAME_1 + " 2nd", INFORMATION_TYPE_NAME);
        assertThat(updateEntity.getBody().getContent().get(1).getProcess().getName(), is(PROCESS_NAME_1 + " 2nd"));
        assertThat(policyRepository.count(), is(2L));
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


        var resp = restTemplate.exchange(POLICY_REST_ENDPOINT, HttpMethod.PUT, new HttpEntity<>(requestList), String.class);

        assertThat(resp.getStatusCode(), is(HttpStatus.BAD_REQUEST));
        assertThat(resp.getBody(), containsString("fe566351-da4d-43b0-a2e9-b09e41ff8aa7/[KONTROLL] -- fieldIsNullOrMissing -- processId was null or missing"));
        assertThat(resp.getBody(), containsString(postadressId + "/[KONTROLL] -- fieldIsNullOrMissing -- processId was null or missing"));
        // No error reported regarding Arbeidsforhold/TEST1
        assertFalse(resp.getBody().contains("Arbeidsforhold/TEST1"));
        assertThat(policyRepository.count(), is(3L));
    }

    @Test
    void updateNotExistingPolicy() {
        PolicyRequest request = createPolicyRequest(createAndSaveInformationType());
        request.setId("1-1-1-1-1");

        var resp = restTemplate.exchange(POLICY_REST_ENDPOINT + "/1-1-1-1-1", HttpMethod.PUT, new HttpEntity<>(request), Policy.class);

        assertThat(resp.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    void deletePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        ResponseEntity<PolicyPage> createEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT, HttpMethod.POST, new HttpEntity<>(requestList), PolicyPage.class);
        assertThat(createEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(createEntity.getBody(), notNullValue());
        PolicyResponse policy = createEntity.getBody().getContent().get(0);

        ResponseEntity<String> deleteEntity = restTemplate.exchange(
                POLICY_REST_ENDPOINT + "/" +policy.getId(), HttpMethod.DELETE, new HttpEntity<>(new HttpHeaders()), String.class);
        assertThat(deleteEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void deleteNotExistingPolicy() {

        var resp = restTemplate.exchange(
                    POLICY_REST_ENDPOINT + "/1-1-1-1-1", HttpMethod.DELETE, new HttpEntity<>(new HttpHeaders()), String.class);
        assertThat(resp.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }

    @Test
    void get20FirstPolicies() {
        createAndSavePolicy(100);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT,
                PolicyPage.class);
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

        ResponseEntity<PolicyPage> responseEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT + "?pageNumber=0&pageSize=25",
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

        ResponseEntity<Long> responseEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT + "/count",
                Long.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), is(100L));
    }

    @Test
    void getPoliciesPageBeyondMax() {
        createAndSavePolicy(100);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT + "?pageNumber=1&pageSize=100",
                PolicyPage.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getNumberOfElements(), is(0L));
        assertThat(policyRepository.count(), is(100L));
    }

    @Test
    void getPolicyForProcess() {
        List<Policy> policies = createAndSavePolicy(5);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT + "?processId={id}",
                PolicyPage.class,
                policies.get(0).getProcess().getId());

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getTotalElements(), is(5L));
        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void getPolicyForInformationType1() {
        createAndSavePolicy(5);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT + "?informationTypeId={id}",
                PolicyPage.class, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getTotalElements(), is(5L));
        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void countPolicyForInformationType1() {
        createAndSavePolicy(5);

        ResponseEntity<Long> responseEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT + "/count?informationTypeId={id}",
                Long.class,
                INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), is(5L));
    }

    @Test
    void getPoliciesForInformationType() {
        createAndSavePolicy(5);

        ResponseEntity<PolicyPage> responseEntity = restTemplate.getForEntity(
                POLICY_REST_ENDPOINT + "?informationTypeId={id}",
                PolicyPage.class, INFORMATION_TYPE_ID_1);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(responseEntity.getBody(), notNullValue());
        assertThat(responseEntity.getBody().getTotalElements(), is(5L));
        assertThat(policyRepository.count(), is(5L));
    }

    private PolicyRequest createPolicyRequest(InformationType informationType) {
        return PolicyRequest.builder()
                .legalBasesUse(LegalBasesUse.DEDICATED_LEGAL_BASES)
                .subjectCategory("Bruker")
                .processId(PROCESS_ID_1.toString())
                .informationTypeId(informationType.getId().toString())
                .legalBases(List.of(LegalBasisRequest.builder().gdpr("9a").nationalLaw("Ftrl").description("§ 1-4").build()))
                .purpose(PURPOSE_CODE1).build();
    }

    private void assertPolicy(PolicyResponse policy, String process, String informationTypeName) {
        assertThat(policy.getInformationType().getName(), is(informationTypeName));
        assertThat(policy.getProcess().getName(), is(process));
        assertThat(policy.getPurposes().get(0).getCode(), is(PURPOSE_CODE1));
        assertThat(policy.getLegalBasesUse(), is(LegalBasesUse.DEDICATED_LEGAL_BASES));
    }
}