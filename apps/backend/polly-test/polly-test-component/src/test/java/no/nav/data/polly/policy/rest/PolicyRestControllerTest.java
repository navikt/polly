package no.nav.data.polly.policy.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.polly.AppStarter;
import no.nav.data.polly.behandlingsgrunnlag.BehandlingsgrunnlagService;
import no.nav.data.polly.codelist.CodeResponse;
import no.nav.data.polly.common.rest.PageParameters;
import no.nav.data.polly.dataset.DatasetService;
import no.nav.data.polly.policy.PolicyService;
import no.nav.data.polly.policy.domain.DatasetResponse;
import no.nav.data.polly.policy.domain.PolicyRequest;
import no.nav.data.polly.policy.domain.PolicyResponse;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.policy.mapper.PolicyMapper;
import no.nav.data.polly.policy.repository.PolicyRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(PolicyRestController.class)
@ContextConfiguration(classes = AppStarter.class)
@ActiveProfiles("test")
class PolicyRestControllerTest {

    private static final String DATASET_ID_1 = "cd7f037e-374e-4e68-b705-55b61966b2fc";
    private static final String DATASET_ID_2 = "5992e0d0-1fc9-4d67-b825-d198be0827bf";

    @Autowired
    private MockMvc mvc;

    @MockBean
    private PolicyMapper mapper;

    @MockBean
    private PolicyService service;

    @MockBean
    private PolicyRepository policyRepository;

    @MockBean
    private DatasetService datasetService;

    @MockBean
    private BehandlingsgrunnlagService behandlingsgrunnlagService;

    @Test
    void getAllPolicies() throws Exception {
        Policy policy1 = createPolicyTestdata(DATASET_ID_1);
        Policy policy2 = createPolicyTestdata(DATASET_ID_2);

        List<Policy> policies = Arrays.asList(policy1, policy2);
        Page<Policy> policyPage = new PageImpl<>(policies, PageRequest.of(0, 100), 2);
        given(policyRepository.findAll(new PageParameters(0, 100).createIdSortedPage())).willReturn(policyPage);
        mvc.perform(get("/policy?pageNumber=0&pageSize=100")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)));
    }

    @Test
    void getOnePolicy() throws Exception {
        Policy policy1 = createPolicyTestdata(DATASET_ID_1);
        PolicyResponse response = createPolicyResponse("code", "Description", 1L);

        given(policyRepository.findById(1L)).willReturn(Optional.of(policy1));
        given(mapper.mapPolicyToResponse(policy1)).willReturn(response);
        mvc.perform(get("/policy/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.legalBasisDescription", is("Description")));
    }

    @Test
    void getNotExistingPolicy() throws Exception {
        given(policyRepository.findById(1L)).willReturn(Optional.ofNullable(null));
        mvc.perform(get("/policy/1").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void getPoliciesForDataset() throws Exception {
        Policy policy1 = createPolicyTestdata(DATASET_ID_1);

        List<Policy> policies = Collections.singletonList(policy1);
        given(policyRepository.findByDatasetId(DATASET_ID_1)).willReturn(policies);
        mvc.perform(get("/policy?datasetId=" + DATASET_ID_1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));

    }

    @Test
    void countPoliciesForDataset() throws Exception {
        given(policyRepository.countByDatasetId(DATASET_ID_1)).willReturn(1L);
        mvc.perform(get("/policy/count?datasetId=" + DATASET_ID_1).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));
    }

    @Test
    void countPolicies() throws Exception {
        given(policyRepository.count()).willReturn(1L);
        mvc.perform(get("/policy/count").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));
    }


    @Test
    void createOnePolicy() throws Exception {
        Policy policy1 = createPolicyTestdata(DATASET_ID_1);
        List<PolicyRequest> request = Collections.singletonList(new PolicyRequest());
        List<Policy> policies = Collections.singletonList(policy1);

        given(mapper.mapRequestToPolicy(request.get(0), null)).willReturn(policy1);
        given(policyRepository.saveAll(policies)).willReturn(policies);

        mvc.perform(post("/policy")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.*", hasSize(1)));

        verify(datasetService).sync(List.of(UUID.fromString(policy1.getDatasetId())));
    }

    @Test
    void createTwoPolicies() throws Exception {
        Policy policy1 = createPolicyTestdata(DATASET_ID_1);
        Policy policy2 = createPolicyTestdata(DATASET_ID_2);
        List<PolicyRequest> request = Arrays.asList(createPolicyRequest("Desc1", "Code1", "Title1"), createPolicyRequest("Desc2", "Code2", "Title2"));
        List<Policy> policies = Arrays.asList(policy1, policy2);

        given(mapper.mapRequestToPolicy(request.get(0), null)).willReturn(policy1);
        given(mapper.mapRequestToPolicy(request.get(1), null)).willReturn(policy2);
        given(policyRepository.saveAll(policies)).willReturn(policies);

        mvc.perform(post("/policy")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.*", hasSize(2)));
        verify(datasetService).sync(List.of(UUID.fromString(policy1.getDatasetId()), UUID.fromString(policy2.getDatasetId())));
    }

    @Test
    void updatePolicy() throws Exception {
        Policy policy1 = createPolicyTestdata(DATASET_ID_1);
        PolicyRequest request = PolicyRequest.builder().id(1L).build();
        PolicyResponse response = createPolicyResponse("code", "Description", null);

        given(mapper.mapRequestToPolicy(request, 1L)).willReturn(policy1);
        given(policyRepository.findById(1L)).willReturn(Optional.of(policy1));
        given(policyRepository.save(policy1)).willReturn(policy1);
        given(mapper.mapPolicyToResponse(policy1)).willReturn(response);

        mvc.perform(put("/policy/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.legalBasisDescription", is("Description")));
        verify(datasetService).sync(List.of(UUID.fromString(policy1.getDatasetId())));

    }

    @Test
    void updateTwoPolicies() throws Exception {
        Policy policy1 = createPolicyTestdata(DATASET_ID_1);
        Policy policy2 = createPolicyTestdata(DATASET_ID_2);
        List<PolicyRequest> request = Arrays.asList(createPolicyRequest("Desc1", "Code1", "Title1"), createPolicyRequest("Desc2", "Code2", "Title2"));
        List<Policy> policies = Arrays.asList(policy1, policy2);

        given(mapper.mapRequestToPolicy(request.get(0), request.get(0).getId())).willReturn(policy1);
        given(mapper.mapRequestToPolicy(request.get(1), request.get(1).getId())).willReturn(policy2);
        given(policyRepository.findById(request.get(0).getId())).willReturn(Optional.of(policy1));
        given(policyRepository.findById(request.get(1).getId())).willReturn(Optional.of(policy2));
        given(policyRepository.saveAll(policies)).willReturn(policies);

        mvc.perform(put("/policy")
                .contentType(MediaType.APPLICATION_JSON)
                .content(asJsonString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.*", hasSize(2)));
        verify(datasetService).sync(List.of(UUID.fromString(policy1.getDatasetId()), UUID.fromString(policy2.getDatasetId())));

    }

    @Test
    void deletePolicy() throws Exception {
        Policy policy1 = createPolicyTestdata(DATASET_ID_1);
        given(policyRepository.findById(1L)).willReturn(Optional.of(policy1));

        mvc.perform(delete("/policy/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
        verify(datasetService).sync(List.of(UUID.fromString(policy1.getDatasetId())));

    }

    @Test
    void deleteNotExistsingPolicy() throws Exception {
        doThrow(new EmptyResultDataAccessException(1)).when(policyRepository).deleteById(1L);
        mvc.perform(delete("/policy/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    private Policy createPolicyTestdata(String datasetId) {
        Policy policy = new Policy();
        policy.setDatasetId(datasetId);
        policy.setLegalBasisDescription("Description");
        return policy;
    }

    private PolicyRequest createPolicyRequest(String desc, String code, String title) {
        return PolicyRequest.builder().legalBasisDescription(desc).purposeCode(code).datasetTitle(title).build();
    }

    private PolicyResponse createPolicyResponse(String purpose, String desc, Long id) {
        return PolicyResponse.builder().policyId(id).purpose(new CodeResponse(purpose, "")).dataset(new DatasetResponse()).legalBasisDescription(desc).build();
    }

    private static String asJsonString(final Object obj) {
        try {
            return new ObjectMapper().writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
