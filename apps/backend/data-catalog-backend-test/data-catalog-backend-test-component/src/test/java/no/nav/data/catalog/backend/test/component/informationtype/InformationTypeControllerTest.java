package no.nav.data.catalog.backend.test.component.informationtype;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.informationtype.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.LongStream;

import static no.nav.data.catalog.backend.test.component.informationtype.TestdataInformationTypes.*;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@RunWith(SpringRunner.class)
@WebMvcTest(InformationTypeController.class)
@ContextConfiguration(classes = AppStarter.class)
@ActiveProfiles("test")
public class InformationTypeControllerTest {

	private HashMap<ListName, HashMap<String, String>> codelists = new HashMap<>();
	private Pageable defaultPageable = PageRequest.of(0, 20);

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
		codelists = CodelistService.codelists;
		codelists.put(ListName.CATEGORY, new HashMap<>());
		codelists.put(ListName.PRODUCER, new HashMap<>());
		codelists.put(ListName.SYSTEM, new HashMap<>());

		codelists.get(ListName.CATEGORY).put(CATEGORY_CODE, CATEGORY_DESCRIPTION);
		codelists.get(ListName.PRODUCER).put(PRODUCER_CODE_LIST.get(0), PRODUCER_DESCRIPTION_LIST.get(0));
		codelists.get(ListName.PRODUCER).put(PRODUCER_CODE_LIST.get(1), PRODUCER_DESCRIPTION_LIST.get(1));
		codelists.get(ListName.SYSTEM).put(SYSTEM_CODE, SYSTEM_DESCRIPTION);
	}

	@Test
	public void getInformationTypeById_shouldGetInformationType_whenIdExists() throws Exception {
		InformationType informationType = createInformationtTypeTestData(1L, "infoType1");

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
	public void getInformationTypeByName_shouldGetInformationType_WhenNameExists() throws Exception {
		String name = "Test";
		InformationType informationType = createInformationtTypeTestData(1L, name);

		given(repository.findByName(name))
				.willReturn(Optional.of(informationType));

		mvc.perform(get(URL + "/name/" + name))
				.andExpect(status().isOk());
	}


	@Test
	public void get20InformationTypes() throws Exception {
		List<InformationType> informationTypes = createTestdataInformationType(20);
		Page<InformationType> informationTypePage = new PageImpl<>(informationTypes);

		given(repository.findAllByOrderByIdAsc(PageRequest.of(0, 20))).willReturn(informationTypePage);
		given(repository.findAll((Specification<InformationType>) null, defaultPageable)).willReturn(informationTypePage);
		given(repository.count()).willReturn(20L);

		mvc.perform(get("/backend/informationtype")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements", is(20)))
				.andExpect(jsonPath("$.content", hasSize(20)));
	}

	@Test
	public void countInformationTypes() throws Exception {
		given(repository.count()).willReturn(20L);

		mvc.perform(get("/backend/informationtype/count")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().string("20"));
	}

	@Test
	public void getAllInformationTypes_shouldGetEmptyList_whenRepositoryIsEmpty() throws Exception {
		Page<InformationType> informationTypePage = new PageImpl<>(Collections.emptyList(), defaultPageable, 0);

		given(repository.findAll((Specification<InformationType>) null, defaultPageable)).willReturn(informationTypePage);

		mvc.perform(get("/backend/informationtype")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(0)))
				.andExpect(jsonPath("$.currentPage", is(0)))
				.andExpect(jsonPath("$.pageSize", is(20)))
				.andExpect(jsonPath("$.totalElements", is(0)));
	}

	@Test
	public void getAllInformationTypes_shouldGetPagedList_whenRequestContainsPageInformation() throws Exception {
		List<InformationType> informationTypes = createTestdataInformationType(30);
		Pageable pageable = PageRequest.of(1, 10, Sort.by("id").descending());


		Page<InformationType> informationTypePage =
				new PageImpl<>(informationTypes, pageable, informationTypes.size());

		given(repository.findAll((Specification<InformationType>) null, pageable)).willReturn(informationTypePage);
		given(repository.count()).willReturn(30L);

		mvc.perform(get("/backend/informationtype?page=1&pageSize=10&sort=id,desc")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(30)))
				.andExpect(jsonPath("$.currentPage", is(1)))
				.andExpect(jsonPath("$.pageSize", is(10)))
				.andExpect(jsonPath("$.totalElements", is(30)));
	}

	@Test
	public void getAllInformationTypes_shouldGetListSpecifiedInQuery_whenRequestContainsFilterInformation() throws Exception {
		List<InformationType> informationTypes = createTestdataInformationType(10);
		informationTypes.add(createInformationtTypeTestData(11L, "filterMe_1"));
		informationTypes.add(createInformationtTypeTestData(12L, "filterMe_2"));
		List<InformationType> answers = List.of(informationTypes.get(10), informationTypes.get(11));

		Page<InformationType> informationTypePage =
				new PageImpl<>(answers, defaultPageable, answers.size());

		given(repository.findAll(any(Specification.class), any(Pageable.class))).willReturn(informationTypePage);
		given(repository.count()).willReturn(2L);

		mvc.perform(get("/backend/informationtype?name=filterMe")
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", hasSize(2)))
				.andExpect(jsonPath("$.currentPage", is(0)))
				.andExpect(jsonPath("$.pageSize", is(20)))
				.andExpect(jsonPath("$.totalElements", is(2)));
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

		then(service).should(times(1)).validateRequests(anyList(), anyBoolean());
		then(repository).should(times(1)).saveAll(anyList());
	}

	@Test
	public void createInformationTypes_shouldFailToCreateNewInformationType_WithEmptyRequest() throws Exception {
		List<InformationTypeRequest> requests = List.of(InformationTypeRequest.builder().build());
		HashMap<String, HashMap> validationErrors = new HashMap<>();

		willThrow(new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: "))
				.given(service).validateRequests(requests, false);

		mvc.perform(post(URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(asJsonString(requests)))
				.andExpect(status().isBadRequest());

		then(service).should(times(1)).validateRequests(requests, false);
		then(repository).should(never()).save(any(InformationType.class));
	}

	@Test
	public void updateInformationTypes_shouldUpdateTwoInformationTypes() throws Exception {
		List<InformationTypeRequest> requests = List.of(
				createInformationTypeRequestTestData("UpdateInformationType_1"),
				createInformationTypeRequestTestData("UpdateInformationType_2"));

		List<InformationType> updatedInformationTypes = requests.stream()
				.map(request -> new InformationType().convertFromRequest(request, true))
				.collect(Collectors.toList());

		given(repository.findByName(requests.get(0).getName()))
				.willReturn(Optional.of(new InformationType().convertFromRequest(requests.get(0), false)));
		given(repository.findByName(requests.get(1).getName()))
				.willReturn(Optional.of(new InformationType().convertFromRequest(requests.get(1), false)));
		given(repository.saveAll(updatedInformationTypes)).willReturn(updatedInformationTypes);

		mvc.perform(post(URL).contentType(MediaType.APPLICATION_JSON)
				.content(asJsonString(requests)))
				.andExpect(status().isAccepted());

		then(service).should(times(1)).validateRequests(anyList(), anyBoolean());
		then(repository).should(times(1)).saveAll(anyList());
	}

	@Test
	public void updateOneInformationTypeById_shouldUpdateInformationType_WithValidRequest() throws Exception {
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
		then(service).should(times(1)).validateRequests(List.of(request), true);
		then(repository).should(times(1)).save(any(InformationType.class));
	}

	@Test
	public void updateOneInformationTypeById_shouldFailToUpdateInformationType_WhenIdDoesNotExist() throws Exception {
		InformationTypeRequest request = InformationTypeRequest.builder().build();

		given(repository.findById(1L)).willReturn(Optional.empty());

		mvc.perform(put(URL + "/1")
				.contentType(MediaType.APPLICATION_JSON)
				.content(asJsonString(request)))
				.andExpect(status().isNotFound());

		then(repository).should(times(1)).findById(1L);
		then(service).should(never()).validateRequests(List.of(request), true);
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

	private List<InformationType> createTestdataInformationType(int nrOfRows) {
		return LongStream.rangeClosed(1, nrOfRows)
				.mapToObj(i -> createInformationtTypeTestData(i, "infoType_" + i))
				.collect(Collectors.toList());
	}


	private InformationType createInformationtTypeTestData(Long id, String name) {
		return InformationType.builder()
				.id(id)
				.name(name)
				.description(DESCRIPTION)
				.categoryCode(CATEGORY_CODE)
				.producerCode(PRODUCER_CODE_STRING)
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
				.producerCode(PRODUCER_CODE_LIST)
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
