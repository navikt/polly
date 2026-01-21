package no.nav.data.polly.policy.rest;

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

        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isCreated();

        assertThat(policyRepository.count(), is(1L));
        UUID id = policyRepository.findAll().getFirst().getId();

        PolicyResponse created = webTestClient.get()
                .uri(POLICY_REST_ENDPOINT + "/" + id)
                .exchange()
                .expectStatus().isOk()
                .expectBody(PolicyResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(created, notNullValue());
        assertPolicy(created, PROCESS_NAME_1, INFORMATION_TYPE_NAME);
    }

    @Test
    void createPolicyThrowNullableValidationException() {
        List<PolicyRequest> requestList = List.of(PolicyRequest.builder().build());

        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isBadRequest();

        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void createPolicyThrowDuplicateValidationException() {
        InformationType informationType = createAndSaveInformationType();
        List<PolicyRequest> requestList = Arrays.asList(createPolicyRequest(informationType), createPolicyRequest(informationType));

        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void createPolicyThrowDuplicateOnProcessValidationException() {
        InformationType informationType = createAndSaveInformationType();

        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(List.of(createPolicyRequest(informationType)))
                .exchange()
                .expectStatus().isCreated();

        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(List.of(createPolicyRequest(informationType)))
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    void createPolicyThrowNotFoundValidationException() {
        createPolicyRequest(createAndSaveInformationType());
        List<PolicyRequest> requestList = Collections.singletonList(PolicyRequest.builder().subjectCategory("NOTFOUND").purpose("NOTFOUND")
                .processId("17942455-4e86-4315-a7b2-872accd9c856")
                .informationTypeId("b7a86238-c6ca-4e5e-9233-9089d162400c").build());

        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isBadRequest();

        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void getOnePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isCreated();

        assertThat(policyRepository.count(), is(1L));
        UUID id = policyRepository.findAll().getFirst().getId();

        PolicyResponse fetched = webTestClient.get()
                .uri(POLICY_REST_ENDPOINT + "/" + id)
                .exchange()
                .expectStatus().isOk()
                .expectBody(PolicyResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(fetched, notNullValue());
        assertPolicy(fetched, PROCESS_NAME_1, INFORMATION_TYPE_NAME);
        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void getNotExistingPolicy() {

        webTestClient.get()
                .uri(POLICY_REST_ENDPOINT + "/1-1-1-1-1")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void updateOnePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isCreated();

        assertThat(policyRepository.count(), is(1L));
        UUID id = policyRepository.findAll().getFirst().getId();

        PolicyRequest request = requestList.get(0);
        request.setId(id.toString());
        request.setProcessId(PROCESS_ID_2.toString());
        var newInfoType = createAndSaveInformationType(UUID.randomUUID(), "newname");
        request.setInformationTypeId(newInfoType.getId().toString());

        PolicyResponse updated = webTestClient.put()
                .uri(POLICY_REST_ENDPOINT + "/" + id)
                .bodyValue(request)
                .exchange()
                .expectStatus().isOk()
                .expectBody(PolicyResponse.class)
                .returnResult()
                .getResponseBody();

        assertThat(policyRepository.count(), is(1L));
        assertThat(updated, notNullValue());
        assertPolicy(updated, PROCESS_NAME_1 + " 2nd", newInfoType.getData().getName());
        assertThat(policyRepository.findByInformationTypeId(newInfoType.getId()), hasSize(1));
    }

    @Test
    void updateOnePolicyThrowValidationExeption() {
        PolicyRequest request = createPolicyRequest(createAndSaveInformationType());
        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(List.of(request))
                .exchange()
                .expectStatus().isCreated();

        UUID id = policyRepository.findAll().getFirst().getId();

        request.setId(id.toString());
        request.setInformationTypeId(null);

        webTestClient.put()
                .uri(POLICY_REST_ENDPOINT + "/" + request.getId())
                .bodyValue(request)
                .exchange()
                .expectStatus().isBadRequest();

        assertThat(policyRepository.count(), is(1L));
    }

    @Test
    void updateTwoPolices() {
        List<PolicyRequest> requestList = Arrays
                .asList(createPolicyRequest(createAndSaveInformationType()), createPolicyRequest(createAndSaveInformationType(UUID.randomUUID(), "Postadresse")));

        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isCreated();

        assertThat(policyRepository.count(), is(2L));
        var createdPolicies = policyRepository.findAll();

        requestList.forEach(request -> request.setProcessId(PROCESS_ID_2.toString()));
        requestList.get(0).setId(createdPolicies.get(0).getId().toString());
        requestList.get(1).setId(createdPolicies.get(1).getId().toString());

        webTestClient.put()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isOk();

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

        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isCreated();

        assertThat(policyRepository.count(), is(3L));
        var createdPolicies = policyRepository.findAll();

        requestList.get(0).setProcessId(null);
        requestList.get(1).setProcessId(null);
        requestList.get(2).setProcessId(PROCESS_ID_2.toString());
        requestList.get(0).setId(createdPolicies.get(0).getId().toString());
        requestList.get(1).setId(createdPolicies.get(1).getId().toString());
        requestList.get(2).setId(createdPolicies.get(2).getId().toString());

        webTestClient.put()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isBadRequest();

        assertThat(policyRepository.count(), is(3L));
    }

    @Test
    void updateNotExistingPolicy() {
        PolicyRequest request = createPolicyRequest(createAndSaveInformationType());
        request.setId("1-1-1-1-1");

        webTestClient.put()
                .uri(POLICY_REST_ENDPOINT + "/1-1-1-1-1")
                .bodyValue(request)
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void deletePolicy() {
        List<PolicyRequest> requestList = List.of(createPolicyRequest(createAndSaveInformationType()));
        webTestClient.post()
                .uri(POLICY_REST_ENDPOINT)
                .bodyValue(requestList)
                .exchange()
                .expectStatus().isCreated();

        assertThat(policyRepository.count(), is(1L));
        UUID id = policyRepository.findAll().getFirst().getId();

        webTestClient.method(org.springframework.http.HttpMethod.DELETE)
                .uri(POLICY_REST_ENDPOINT + "/" + id)
                .header("dummy", "dummy")
                .exchange()
                .expectStatus().isOk();

        assertThat(policyRepository.count(), is(0L));
    }

    @Test
    void deleteNotExistingPolicy() {

        webTestClient.delete()
                .uri(POLICY_REST_ENDPOINT + "/1-1-1-1-1")
                .exchange()
                .expectStatus().isNotFound();
    }

    @Test
    void get20FirstPolicies() {
        createAndSavePolicy(100);

        webTestClient.get()
                .uri(POLICY_REST_ENDPOINT)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.numberOfElements").isEqualTo(20)
                .jsonPath("$.totalElements").isEqualTo(100)
                .jsonPath("$.pageSize").isEqualTo(20);

        assertThat(policyRepository.count(), is(100L));
    }

    @Test
    void getManyPolicies() {
        createAndSavePolicy(25);

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(POLICY_REST_ENDPOINT)
                        .queryParam("pageNumber", 0)
                        .queryParam("pageSize", 25)
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.numberOfElements").isEqualTo(25)
                .jsonPath("$.totalElements").isEqualTo(25)
                .jsonPath("$.pageSize").isEqualTo(25);

        assertThat(policyRepository.count(), is(25L));
    }

    @Test
    void countPolicies() {
        createAndSavePolicy(100);

        Long body = webTestClient.get()
                .uri(POLICY_REST_ENDPOINT + "/count")
                .exchange()
                .expectStatus().isOk()
                .expectBody(Long.class)
                .returnResult()
                .getResponseBody();

        assertThat(body, is(100L));
    }

    @Test
    void getPoliciesPageBeyondMax() {
        createAndSavePolicy(100);

        webTestClient.get()
                .uri(POLICY_REST_ENDPOINT + "?pageNumber=1&pageSize=100")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.numberOfElements").isEqualTo(0);

        assertThat(policyRepository.count(), is(100L));
    }

    @Test
    void getPolicyForProcess() {
        List<Policy> policies = createAndSavePolicy(5);

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(POLICY_REST_ENDPOINT)
                        .queryParam("processId", policies.get(0).getProcess().getId())
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.totalElements").isEqualTo(5);

        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void getPolicyForInformationType1() {
        createAndSavePolicy(5);

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(POLICY_REST_ENDPOINT)
                        .queryParam("informationTypeId", INFORMATION_TYPE_ID_1)
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.totalElements").isEqualTo(5);

        assertThat(policyRepository.count(), is(5L));
    }

    @Test
    void countPolicyForInformationType1() {
        createAndSavePolicy(5);

        Long body = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(POLICY_REST_ENDPOINT + "/count")
                        .queryParam("informationTypeId", INFORMATION_TYPE_ID_1)
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody(Long.class)
                .returnResult()
                .getResponseBody();

        assertThat(body, is(5L));
    }

    @Test
    void getPoliciesForInformationType() {
        createAndSavePolicy(5);

        webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(POLICY_REST_ENDPOINT)
                        .queryParam("informationTypeId", INFORMATION_TYPE_ID_1)
                        .build())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.totalElements").isEqualTo(5);

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
