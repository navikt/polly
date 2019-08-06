package no.nav.data.catalog.backend.test.component.informationtype;

import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import no.nav.data.catalog.backend.app.policy.PolicyConsumer;
import no.nav.data.catalog.backend.app.policy.PolicyResponse;
import no.nav.data.catalog.backend.test.component.codelist.CodelistMock;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_CREATED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyLong;
import static org.mockito.Mockito.anyMap;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class InformationTypeServiceTest {

	private static InformationType informationType;
	private static PolicyResponse policy;

	@Mock
	private InformationTypeRepository informationTypeRepository;

	@Mock
	private ElasticsearchRepository elasticsearchRepository;

	@Mock
	private PolicyConsumer policyConsumer;

	@InjectMocks
	private InformationTypeService service;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	@Before
	public void init() {
        CodelistMock.initializeCodelist();

		informationType = InformationType.builder()
				.id(1L)
				.name("InformationName")
				.description("InformationDescription")
				.categoryCode("PERSONALIA")
				.producerCode("SKATTEETATEN, BRUKER")
				.systemCode("TPS")
				.personalData(true)
				.elasticsearchId("esId")
				.elasticsearchStatus(TO_BE_CREATED)
				.build();
		informationType.setCreatedBy("testCreatedBy");
		informationType.setCreatedDate(new Date());
		informationType.setLastModifiedBy(null);
		informationType.setLastModifiedDate(null);

		policy = PolicyResponse.builder().policyId(1L).legalBasisDescription("Legal description").purpose(Map.of("code", "purposeCode", "description", "Purpose description")).build();

	}

	@Test
	public void shouldSyncCreatedInformationTypes() {
		List<InformationType> informationTypes = new ArrayList<>();
		informationTypes.add(informationType);
		List<PolicyResponse> policies = new ArrayList<>();
		policies.add(policy);
		when(informationTypeRepository.findByElasticsearchStatus(TO_BE_CREATED)).thenReturn(Optional.of(informationTypes));
		when(policyConsumer.getPolicyForInformationType(anyLong())).thenReturn(policies);

		service.synchToElasticsearch();
		verify(elasticsearchRepository, times(1)).insertInformationType(anyMap());
		verify(elasticsearchRepository, times(0)).updateInformationTypeById(anyString(), anyMap());
		verify(elasticsearchRepository, times(0)).deleteInformationTypeById(anyString());
		verify(informationTypeRepository, times(1)).save(any(InformationType.class));
		verify(informationTypeRepository, times(0)).deleteById(anyLong());
	}

	@Test
	public void shouldSyncUpdatedInformationTypes() {
		List<InformationType> informationTypes = new ArrayList<>();
		informationTypes.add(informationType);
		List<PolicyResponse> policies = new ArrayList<>();
		policies.add(policy);
		when(policyConsumer.getPolicyForInformationType(anyLong())).thenReturn(policies);
		when(informationTypeRepository.findByElasticsearchStatus(TO_BE_UPDATED)).thenReturn(Optional.of(informationTypes));

		service.synchToElasticsearch();
		verify(elasticsearchRepository, times(0)).insertInformationType(anyMap());
		verify(elasticsearchRepository, times(1)).updateInformationTypeById(any(), anyMap());
		verify(elasticsearchRepository, times(0)).deleteInformationTypeById(anyString());
		verify(informationTypeRepository, times(1)).save(any(InformationType.class));
		verify(informationTypeRepository, times(0)).deleteById(anyLong());
	}

	@Test
	public void shouldSyncDeletedInformationTypes() {
		List<InformationType> informationTypes = new ArrayList<>();
		informationTypes.add(informationType);
		when(informationTypeRepository.findByElasticsearchStatus(TO_BE_DELETED)).thenReturn(Optional.of(informationTypes));

		service.synchToElasticsearch();
		verify(elasticsearchRepository, times(0)).insertInformationType(anyMap());
		verify(elasticsearchRepository, times(0)).updateInformationTypeById(any(), anyMap());
		verify(elasticsearchRepository, times(1)).deleteInformationTypeById(any());
		verify(informationTypeRepository, times(0)).save(any(InformationType.class));
		verify(informationTypeRepository, times(1)).deleteById(any());
	}

	@Test
	public void validateRequestsCreate_shouldValidateOneInsertRequest() {
		service.validateRequests(createListOfOneRequest("Name"), false);
	}

	@Test
	public void validateRequestCreate_shouldThrowValidationException_withEmptyListOfRequests() {
		try {
			service.validateRequests(Collections.emptyList(), false);
		} catch (ValidationException e) {
			assertThat(e.getLocalizedMessage(), is("The request was not accepted because it is empty"));
		}
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_whenCodelistExistsInRequest() {
		List<InformationTypeRequest> requests = new ArrayList<>();
		requests.add(createOneRequest("TEST_1"));
		requests.add(createOneRequest("TEST_2"));
		requests.add(createOneRequest("TEST_3"));
		requests.add(createOneRequest("TEST_1"));

		try {
			service.validateRequests(requests, false);
		} catch (ValidationException e) {
			assertThat(e.get().size(), is(1));
			assertThat(e.get().get("NotUniqueRequests").size(), is(1));
			assertThat(e.get().get("NotUniqueRequests").get("TEST_1"),
					is("Request:4 - The name TEST_1 is not unique because it has already been used in this request (see request:1)"));
		}
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_whenRequestHasEmptyFields() {
		InformationTypeRequest request = InformationTypeRequest.builder().build();
		try {
			service.validateRequests(List.of(request), false);
		} catch (ValidationException e) {
			Map validationMap = e.get().get("Request:1");
			assertThat(validationMap.size(), is(6));
			assertThat(validationMap.get("name"), is("The name was null or empty"));
			assertThat(validationMap.get("description"), is("The description was null or empty"));
			assertThat(validationMap.get("personalData"), is("PersonalData cannot be null"));
			assertThat(validationMap.get("producerCode"), is("The list of producerCodes was null or empty"));
			assertThat(validationMap.get("categoryCode"), is("The categoryCode was null or empty"));
			assertThat(validationMap.get("systemCode"), is("The systemCode was null or empty"));
		}
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_whenInformationTypeExistsInRepository() {
		InformationTypeRequest request = InformationTypeRequest.builder()
				.categoryCode("PERSONALIA")
				.name("NotUniqueName")
				.systemCode("TPS")
				.producerCode(List.of("SKATTEETATEN", "BRUKER"))
				.personalData(true)
				.build();

		when(informationTypeRepository.findByName(anyString())).thenReturn(Optional.of(new InformationType().convertFromRequest(request, false)));
		try {
			service.validateRequests(createListOfOneRequest("NotUniqueName"), false);
		} catch (ValidationException e) {
			Map validationMap = e.get().get("Request:1");
			assertThat(validationMap.size(), is(1));
			assertThat(validationMap.get("nameAlreadyUsed"),
					is("The name NotUniqueName is already in use by another InformationType and therefore cannot be created"));
		}
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_withUnknownCodeInProducerList() {
		List<InformationTypeRequest> requests = createListOfOneRequest("Name");
		requests.get(0).setProducerCode(List.of("UnknownProducerCode"));

		try {
			service.validateRequests(requests, false);
		} catch (ValidationException e) {
			Map validationMap = e.get().get("Request:1");
			assertThat(validationMap.size(), is(1));
			assertThat(validationMap.get("producerCode"), is("The code UNKNOWNPRODUCERCODE was not found in the codelist(PRODUCER)"));
		}
	}

	@Test
	public void validateRequestsCreate_shouldReturnValidationErrorsForGithubRequest() {
		List<InformationTypeRequest> requests = createListOfOneRequest("Name");
		InformationTypeRequest request = requests.get(0);
		request.setGithubFile("ghf");
		request.setGithubFileOrdinal(0);
		request.setProducerCode(List.of("UnknownProducerCode"));

		Map<String, Map<String, String>> validationMap = service.validateRequestsAndReturnErrors(requests, false);
		assertThat(validationMap.size(), is(1));
		Map validationForRequest = validationMap.get(request.getRequestReference().orElse(null));
		assertThat(validationForRequest.get("producerCode"), is("The code UNKNOWNPRODUCERCODE was not found in the codelist(PRODUCER)"));
	}

	@Test
	public void validateRequestsCreate_shouldValidate20Request() {
		service.validateRequests(createRequests(20), false);
	}

	@Test
	public void validateRequestsCreate_shouldThrowValidationException_whenInformationTypeIsDuplicatedInTheRequest() {
		List<InformationTypeRequest> requests = new ArrayList<>();
		requests.add(createOneRequest("TEST_1"));
		requests.add(createOneRequest("TEST_2"));
		requests.add(createOneRequest("TEST_3"));
		requests.add(createOneRequest("TEST_1"));

		try {
			service.validateRequests(requests, false);
		} catch (ValidationException e) {
			Map validationMap = e.get().get("NotUniqueRequests");
			assertThat(validationMap.size(), is(1));
			assertThat(validationMap.get("TEST_1"), is("Request:4 - The name TEST_1 is not unique because it has already been used in this request (see request:1)"));
		}
	}

	@Test
	public void validateRequestUpdate_shouldValidateRequest() {
		List<InformationTypeRequest> requests = createListOfOneRequest("Name");
		InformationType informationType = new InformationType().convertFromRequest(requests.get(0), false);

		when(informationTypeRepository.findByName("Name")).thenReturn(Optional.of(informationType));

		service.validateRequests(requests, true);
	}

	@Test
	public void validateRequestsUpdate_shouldThrowValidationException_withEmptyRequest() {
		InformationTypeRequest request = InformationTypeRequest.builder().build();
		try {
			service.validateRequests(List.of(request), true);
		} catch (ValidationException e) {
			Map validationMap = e.get().get("Request:1");
			assertThat(validationMap.size(), is(6));
			assertThat(validationMap.get("name"), is("The name was null or empty"));
			assertThat(validationMap.get("description"), is("The description was null or empty"));
			assertThat(validationMap.get("personalData"), is("PersonalData cannot be null"));
			assertThat(validationMap.get("producerCode"), is("The list of producerCodes was null or empty"));
			assertThat(validationMap.get("categoryCode"), is("The categoryCode was null or empty"));
			assertThat(validationMap.get("systemCode"), is("The systemCode was null or empty"));
		}
	}

	@Test
	public void validateRequestsUpdate_shouldThrowValidationException_whenInformationTypeDoesNotExist() {
		List<InformationTypeRequest> requests = createListOfOneRequest("DoesNotExist");

		when(informationTypeRepository.findByName("DoesNotExist")).thenReturn(Optional.empty());

		try {
			service.validateRequests(requests, true);
		} catch (ValidationException e) {
			Map validationMap = e.get().get("Request:1");
			assertThat(validationMap.size(), is(1));
			assertThat(validationMap.get("nameNotFound"), is("There is not an InformationType with the name DoesNotExist and therefore it cannot be updated"));
		}
	}

	@Test
	public void validateRequestUpdate_shouldValidate20Request() {
		List<InformationTypeRequest> requests = createRequests(3);

		when(informationTypeRepository.findByName("RequestNr:1")).thenReturn(Optional.of(new InformationType().convertFromRequest(requests
				.get(0), false)));
		when(informationTypeRepository.findByName("RequestNr:2")).thenReturn(Optional.of(new InformationType().convertFromRequest(requests
				.get(1), false)));
		when(informationTypeRepository.findByName("RequestNr:3")).thenReturn(Optional.of(new InformationType().convertFromRequest(requests
				.get(2), false)));

		requests.forEach(request -> request.setDescription("Updated Description"));

		service.validateRequests(requests, true);
	}

	@Test
	public void validateRequest_shouldChangeFieldsInTheRequestToTheCorrectFormat() {
		InformationTypeRequest request = InformationTypeRequest.builder()
				.name("   Trimmed Name   ")
				.description(" Trimmed description ")
				.categoryCode(" perSonAlia  ")
				.systemCode("tps")
				.producerCode(List.of("skatteetaten", "  BruKer  "))
				.personalData(true)
				.build();
		service.validateRequests(List.of(request), false);
		InformationType validatedInformationType = new InformationType().convertFromRequest(request, false);

		assertThat(validatedInformationType.getName(), is("Trimmed Name"));
		assertThat(validatedInformationType.getDescription(), is("Trimmed description"));
		assertThat(validatedInformationType.getCategoryCode(), is("PERSONALIA"));
		assertThat(validatedInformationType.getSystemCode(), is("TPS"));
		assertThat(validatedInformationType.getProducerCode(), is("SKATTEETATEN, BRUKER"));
		assertTrue(validatedInformationType.isPersonalData());
	}

	private List<InformationTypeRequest> createListOfOneRequest(String name) {
		return List.of(createOneRequest(name));
	}

	private InformationTypeRequest createOneRequest(String name) {
		return InformationTypeRequest.builder()
				.categoryCode("PERSONALIA")
				.name(name)
				.systemCode("TPS")
				.producerCode(List.of("SKATTEETATEN", "BRUKER"))
				.description("InformationDescription")
				.personalData(true)
				.build();
	}

	private List<InformationTypeRequest> createRequests(int nrOfRequests) {
		return IntStream.rangeClosed(1, nrOfRequests)
				.mapToObj(i -> createOneRequest("RequestNr:" + i))
				.collect(Collectors.toList());
	}
}
