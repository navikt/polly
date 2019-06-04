package no.nav.data.catalog.backend.test.component.informationtype;

import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.CATEGORY_CODE;
import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.CATEGORY_DESCRIPTION;
import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.DESCRIPTION;
import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.PRODUCER_CODE;
import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.PRODUCER_DESCRIPTION;
import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.SYSTEM_CODE;
import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.SYSTEM_DESCRIPTION;
import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.URL;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeController;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeResponse;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RunWith(SpringRunner.class)
@WebMvcTest(InformationTypeController.class)
@ContextConfiguration(classes = AppStarter.class)
@ActiveProfiles("test")
public class InformationTypeControllerTest {

	private HashMap<ListName, HashMap<String, String>> codelists = new HashMap<>();

	@Autowired
	private MockMvc mvc;

	@MockBean
	private InformationTypeRepository repository;
	@MockBean
	private InformationTypeService service;
	@MockBean
	private CodelistService codelistService;
	@MockBean
	private CodelistRepository codelistRepository;

	@Before
	public void initCodelists() {
		codelists = codelistService.codelists;
		codelists.put(ListName.CATEGORY, new HashMap<>());
		codelists.put(ListName.PRODUCER, new HashMap<>());
		codelists.put(ListName.SYSTEM, new HashMap<>());

		codelists.get(ListName.CATEGORY).put(CATEGORY_CODE, CATEGORY_DESCRIPTION);
		codelists.get(ListName.PRODUCER).put(PRODUCER_CODE, PRODUCER_DESCRIPTION);
		codelists.get(ListName.SYSTEM).put(SYSTEM_CODE, SYSTEM_DESCRIPTION);
	}

	@Test
	public void getInformationTypeById_shouldGetInformationType_whenIdExists() throws Exception {
		InformationType informationType = createInformationtTypeTestData(1L, "infoType1");
		InformationTypeResponse response = informationType.convertToResponse();

		given(repository.findById(1L)).willReturn(Optional.of(informationType));

		mvc.perform(get(URL + "/1")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name", is("infoType1")));
	}

	@Test
	public void getInformationTypeById_shouldGetNotFound_WhenIdDoesNotExist() throws Exception {
		given(repository.findById(1L)).willReturn(Optional.empty());

		mvc.perform(get(URL + "/1")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound());
	}

	@Test
	public void getAllInformationTypes_shouldGetTwoInformationTypes() throws Exception {
		InformationType infoType1 = createInformationtTypeTestData(1L, "infoType1");
		InformationType infoType2 = createInformationtTypeTestData(2L, "infoType2");

		List<InformationType> informationTypes = Arrays.asList(infoType1, infoType1);
		Page<InformationType> informationTypePage = new PageImpl<>(informationTypes);

		given(repository.findAll(PageRequest.of(0, 100))).willReturn(informationTypePage);

		mvc.perform(get("/backend/informationtype?page=0&size=100")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(2)));
	}

	@Test
	public void getAllInformationTypes_shouldGetEmptyList_whenRepositoryIsEmpty() throws Exception {
		Page<InformationType> informationTypePage = new PageImpl<>(Collections.emptyList());

		given(repository.findAll(PageRequest.of(0, 100))).willReturn(informationTypePage);

		mvc.perform(get("/backend/informationtype?page=0&size=100")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(0)));
	}

	@Test
	public void createInformationType_shouldCreateNewInformationType_WithValidRequest() throws Exception {
		List<InformationTypeRequest> requests = List.of(createInformationTypeRequestTestData("Test createInformationType"));
		List<InformationType> createdInformationTypes = requests.stream()
				.map(request -> new InformationType().convertFromRequest(request, false))
				.collect(Collectors.toList());

		given(repository.saveAll(createdInformationTypes)).willReturn(createdInformationTypes);

		mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON)
				.content(asJsonString(requests)))
				.andExpect(status().isAccepted());

//		then(service).should(times(1)).validateRequest(request, false);  //TODO: Fix validation
		then(repository).should(times(1)).saveAll(anyList());
	}

	@Test
	public void createInformationType_shouldFailToCreateNewInformationType_WithInvalidValidRequest() throws Exception {
		List<InformationTypeRequest> requests = List.of(InformationTypeRequest.builder().build());
		HashMap<String, String> validationErrors = new HashMap<>();

		//TODO: Fix validation
//		willThrow(new ValidationException(validationErrors, "Validation errors occured when validating input file from Github."))
//				.given(service).validateRequest(request, false);

//		mvc.perform(post(URL)
//				.contentType(MediaType.APPLICATION_JSON)
//				.content(asJsonString(List.of(request))))
//				.andExpect(status().isBadRequest());
//
//		then(service).should(times(1)).validateRequest(request, false);
//		then(repository).should(never()).save(any(InformationType.class));
	}

	@Test
	public void updateInformationType_shouldUpdateInformationType_WithValidRequest() throws Exception {
		InformationTypeRequest request = createInformationTypeRequestTestData("Test updateInformationType");
		InformationType informationTypeToBeUpdated = new InformationType().convertFromRequest(request, false);
		request.setDescription("UPDATED");
		InformationType updatedInformationType = new InformationType().convertFromRequest(request, true);

		given(repository.findById(1L)).willReturn(Optional.of(informationTypeToBeUpdated));
		given(repository.save(updatedInformationType)).willReturn(updatedInformationType);

		mvc.perform(put(URL + "/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(asJsonString(request)))
				.andExpect(status().isAccepted());

		then(repository).should(times(1)).findById(1L);
		then(service).should(times(1)).validateRequest(request, true);
		then(repository).should(times(1)).save(any(InformationType.class));
	}

	@Test
	public void updateInformationType_shouldFailToUpdateInformationType_WhenIdDoesNotExist() throws Exception {
		InformationTypeRequest request = InformationTypeRequest.builder().build();

		given(repository.findById(1L)).willReturn(Optional.empty());

		mvc.perform(put(URL + "/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(asJsonString(request)))
				.andExpect(status().isNotFound());

		then(repository).should(times(1)).findById(1L);
		then(service).should(never()).validateRequest(request, true);
		then(repository).should(never()).save(any(InformationType.class));
	}

	@Test
	public void deleteInformationTypeById_shouldSetElasticsearchStatusToBeDeleted() throws Exception {
		InformationType infoType = createInformationtTypeTestData(1L, "infoType");
		InformationType infoTypeToBeDeleted = createInformationtTypeTestData(1L, "infoType");
		infoTypeToBeDeleted.setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);

		given(repository.findById(1L)).willReturn(Optional.of(infoType));
		given(repository.save(infoType)).willReturn(infoTypeToBeDeleted);


		mvc.perform(delete(URL + "/1"))
				.andExpect(status().isAccepted());

		then(repository).should(times(1)).findById(1L);
		then(repository).should(times(1)).save(infoType);
	}

	@Test
	public void deleteInformationTypeById_shouldFailToDeleteInformationType_whenIdDOesNotExist() throws Exception {
		InformationTypeRequest request = InformationTypeRequest.builder().build();

		given(repository.findById(1L)).willReturn(Optional.empty());

		mvc.perform(delete(URL + "/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(asJsonString(request)))
				.andExpect(status().isNotFound());

		then(repository).should(times(1)).findById(1L);
		then(repository).should(never()).save(any(InformationType.class));
	}


	private InformationType createInformationtTypeTestData(Long id, String name) {
		return InformationType.builder()
				.id(id)
				.name(name)
				.description(DESCRIPTION)
				.categoryCode(CATEGORY_CODE)
				.producerCode(PRODUCER_CODE)
				.systemCode(SYSTEM_CODE)
				.personalData(true)
				.elasticsearchId("esId")
				.elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
				.build();
	}

	private InformationTypeRequest createInformationTypeRequestTestData(String name) {
		return InformationTypeRequest.builder()
				.name(name)
				.categoryCode(CATEGORY_CODE)
				.producerCode(PRODUCER_CODE)
				.systemCode(SYSTEM_CODE)
				.description(DESCRIPTION)
				.personalData(true)
				.build();
	}

	private String asJsonString(Object obj) {
		try {
			return new ObjectMapper().writeValueAsString(obj);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
