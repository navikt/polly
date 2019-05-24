package no.nav.data.catalog.backend.test.component.informationtype;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.common.UUIDs.base64UUID;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
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
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RunWith(MockitoJUnitRunner.class)
public class InformationTypeControllerTest {

	private static final String BASE_URI = "/backend/informationtype";
	private MockMvc mvc;
	private ObjectMapper objectMapper;
	private HashMap<ListName, HashMap<String, String>> codelists = new HashMap<>();
	private static InformationType informationType;
	private static InformationTypeResponse informationTypeResponse;

	@InjectMocks
	private InformationTypeController informationTypeController;

	@Mock
	private InformationTypeRepository informationTypeRepository;

	@Mock
	private InformationTypeService service;


	@Before
	public void setup() {
		objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
		mvc = MockMvcBuilders.standaloneSetup(informationTypeController).build();

		informationType = InformationType.builder()
				.id(1L)
				.name("Test")
				.description("Test description")
				.category("PERSONALIA")
				.producer("SKATTEETATEN")
				.system("TPS")
				.personalData(true)
				.elasticsearchId(base64UUID())
				.elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
				.build();
		informationType.setCreatedBy("Mr Melk");
		informationType.setCreatedDate(new Date());

//		informationTypeResponse = informationType.convertToResponse();

//		informationTypeResponse = InformationTypeResponse.builder()
//				.elasticsearchId(informationType.getElasticsearchId())
//				.informationTypeId(1L)
//				.name("Test")
//				.description("Test description")
//				.category(CodelistDTO.builder()
//						.code("PERSONALIA")
//						.description("Personalia")
//						.build())
//				.producer(CodelistDTO.builder()
//						.code("SKATTEETATEN")
//						.description("Skatteetaten")
//						.build())
//				.system(CodelistDTO.builder()
//						.code("TPS").description("Tjenestebasert PersondataSystem")
//						.build())
//				.personalData(true)
//				.createdBy("Mr Melk")
//				.createdDate(informationType.getCreatedDate().toString())
//				.build();
	}

	@Ignore //Doesn't work because of dependancy to codelists
	@Test
	public void getInformationTypeById_shouldGetInformationType_WhenIdExists() throws Exception {
		Long id = 1L;

		// given
		given(informationTypeRepository.findById(id))
				.willReturn(Optional.of(informationType));

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.get(BASE_URI + "/" + id))
				.andReturn().getResponse();

		// then
		then(informationTypeRepository).should(times(1)).findById(id);
		assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
		assertThat(response.getContentAsString())
				.isEqualTo(objectMapper.writeValueAsString(informationType));

	}

	@Test
	public void getInformationTypeById_shouldGetNotFound_WhenIdDoesNotExist() throws Exception {
		Long id = 1L;

		// given
		given(informationTypeRepository.findById(id))
				.willReturn(Optional.empty());
//		given(informationTypeController.getContent(informationType)).willReturn(List.of(informationTypeResponse));

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.get(BASE_URI + "/" + id))
				.andReturn().getResponse();

		// then
		then(informationTypeRepository).should(times(1)).findById(id);
		assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
		assertThat(response.getContentAsString()).isEmpty();
	}

	@Ignore //Doesn't work because of dependancy to codelists
	@Test
	public void getAllInformationTypes_shouldGetAllInformationTypes() throws Exception {
		List<InformationType> informationTypes = getInformationTypeList();

		// given
		given(informationTypeRepository.findAllByOrderByIdAsc())
				.willReturn(informationTypes);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.get(BASE_URI))
				.andReturn().getResponse();

		// then
		then(informationTypeRepository).should(times(1)).findAllByOrderByIdAsc();
		assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
		assertThat(response.getContentAsString())
				.isEqualTo(objectMapper.writeValueAsString(informationTypes));
	}

	@Test
	public void getAllInformationTypes_shouldReturnEmptyList_WhenRepositoryIsEmpty() throws Exception {
		List<InformationType> emptyList = new ArrayList<>();

		// given
		given(informationTypeRepository.findAllByOrderByIdAsc())
				.willReturn(emptyList);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.get(BASE_URI))
				.andReturn().getResponse();

		// then
		then(informationTypeRepository).should(times(1)).findAllByOrderByIdAsc();
		assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
		assertThat(response.getContentAsString()).isEmpty();
	}

	@Test
	public void createInformationType_shouldCreateNewInformationType_WithValidRequest() throws Exception {
		InformationTypeRequest request = InformationTypeRequest.builder()
				.name("Test createInformationType")
				.category("PERSONALIA")
				.producer("BRUKER")
				.system("TPS")
				.description("Informasjon til test hentet av bruker")
				.personalData(true)
				.build();
		InformationType createdInformationType = new InformationType().convertFromRequest(request, false);
		createdInformationType.setId(10L);

		// given
		given(informationTypeRepository.save(any(InformationType.class)))
				.willReturn(createdInformationType);


		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.post(BASE_URI)
						.contentType(MediaType.APPLICATION_JSON_UTF8)
						.content(objectMapper.writeValueAsString(request)))
				.andReturn().getResponse();

		// then
		then(service).should(times(1)).validateRequest(any(InformationTypeRequest.class), anyBoolean());
		then(informationTypeRepository).should(times(1)).save(any(InformationType.class));
		assertThat(response.getStatus()).isEqualTo(HttpStatus.ACCEPTED.value());
		assertThat(response.getContentAsString())
				.isEqualTo(objectMapper.writeValueAsString(createdInformationType));
		assertThat(createdInformationType.getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_CREATED);
	}

	@Test
	public void createInformationType_shouldFailToCreateNewInformationType_WithInvalidValidRequest() throws Exception {
		InformationTypeRequest request = InformationTypeRequest.builder().build();
		HashMap<String, String> validationErrors = new HashMap<>();
		validationErrors.put("name", "Name must have value");
		validationErrors.put("producer", "The producer was null or not found in the producer codelist.");
		validationErrors.put("category", "The category was null or not found in the category codelist.");
		validationErrors.put("system", "The system was null or not found in the system codelist.");
		validationErrors.put("createdBy", "Created by cannot be null or empty.");

		// given
		willThrow(new ValidationException(validationErrors, "Validation errors occured when validating input file from Github."))
				.given(service).validateRequest(request, false);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.post(BASE_URI)
						.contentType(MediaType.APPLICATION_JSON_UTF8)
						.content(objectMapper.writeValueAsString(request)))
				.andReturn().getResponse();

		// then
		then(service).should(times(1)).validateRequest(request, false);
		then(informationTypeRepository).should(never()).save(any(InformationType.class));
		assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
		assertThat(response.getContentAsString()).isEqualTo(objectMapper.writeValueAsString(validationErrors));
	}

	@Test
	public void createInformationType_shouldFailToCreateNewInformationType_WhenNameAlreadyExists() throws Exception {
		InformationTypeRequest request = InformationTypeRequest.builder()
				.name("Test")
				.category("PERSONALIA")
				.producer("BRUKER")
				.system("TPS")
				.description("Duplicates of InformationTypes aren't allowed")
				.personalData(true)
				.build();
		InformationType createdInformationType = new InformationType().convertFromRequest(request, false);
		HashMap<String, String> validationErrors = new HashMap<>();
		validationErrors.put("name", "This name is used for an existing information type.");

		// given
		willThrow(new ValidationException(validationErrors, "Validation errors occured when validating input file from Github."))
				.given(service).validateRequest(request, false);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.post(BASE_URI)
						.contentType(MediaType.APPLICATION_JSON_UTF8)
						.content(objectMapper.writeValueAsString(request)))
				.andReturn().getResponse();

		// then
		then(service).should(times(1)).validateRequest(request, false);
		then(informationTypeRepository).should(never()).save(any(InformationType.class));
		assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
		assertThat(response.getContentAsString()).isEqualTo(objectMapper.writeValueAsString(validationErrors));
	}


	@Test
	public void updateInformationType_shouldUpdateInformationType_WithValidRequest() throws Exception {
		Long id = 1L;
		InformationTypeRequest request = InformationTypeRequest.builder()
				.name("Test updateInformationType")
				.category("PERSONALIA")
				.producer("BRUKER")
				.system("TPS")
				.description("Test of updateInformationType")
				.personalData(true)
				.build();
		assertThat(informationType.getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_CREATED);
		InformationType informationTypeToBeUpdated = informationType.convertFromRequest(request, true);

		// given
		given(informationTypeRepository.findById(id))
				.willReturn(Optional.of(informationType));
		given(informationTypeRepository.save(informationTypeToBeUpdated))
				.willReturn(informationTypeToBeUpdated);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.put(BASE_URI + "/" + id)
						.contentType(MediaType.APPLICATION_JSON_UTF8)
						.content(objectMapper.writeValueAsString(request)))
				.andReturn().getResponse();

		// then
		then(informationTypeRepository).should(times(1)).findById(id);
		then(service).should(times(1)).validateRequest(request, true);
		then(informationTypeRepository).should(times(1)).save(any(InformationType.class));
		assertThat(response.getStatus()).isEqualTo(HttpStatus.ACCEPTED.value());
		assertThat(response.getContentAsString())
				.isEqualTo(objectMapper.writeValueAsString(informationTypeToBeUpdated));
		assertThat(informationTypeToBeUpdated.getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_UPDATED);
	}

	@Test
	public void updateInformationType_shouldFailToUpdateInformationType_WhenIdDoesNotExist() throws Exception {
		Long id = 1L;
		InformationTypeRequest request = InformationTypeRequest.builder()
				.name("Test updateInformationType")
				.category("PERSONALIA")
				.producer("BRUKER")
				.system("TPS")
				.description("Test of updateInformationType")
				.personalData(true)
				.build();
		// given
		given(informationTypeRepository.findById(id))
				.willReturn(Optional.empty());

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.put(BASE_URI + "/" + id)
						.contentType(MediaType.APPLICATION_JSON_UTF8)
						.content(objectMapper.writeValueAsString(request)))
				.andReturn().getResponse();

		// then
		then(informationTypeRepository).should(times(1)).findById(id);
		then(service).should(never()).validateRequest(request, true);
		then(informationTypeRepository).should(never()).save(any(InformationType.class));

		assertThat(response.getStatus()).isEqualTo(HttpStatus.NOT_FOUND.value());
		assertThat(response.getContentAsString()).isEmpty();

	}


	@Test
	public void updateInformationType_shouldFailToUpdateInformationType_WithInvalidRequest() throws Exception {
		Long id = 1L;

		InformationTypeRequest request = InformationTypeRequest.builder().build();

		HashMap<String, String> validationErrors = new HashMap<>();
		validationErrors.put("name", "Name must have value");
		validationErrors.put("producer", "The producer was null or not found in the producer codelist.");
		validationErrors.put("category", "The category was null or not found in the category codelist.");
		validationErrors.put("system", "The system was null or not found in the system codelist.");
		validationErrors.put("createdBy", "Created by cannot be null or empty.");

		// given
		given(informationTypeRepository.findById(id))
				.willReturn(Optional.of(informationType));
		willThrow(new ValidationException(validationErrors, "Validation errors occured when validating input file from Github."))
				.given(service).validateRequest(request, true);

		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.put(BASE_URI + "/" + id)
						.contentType(MediaType.APPLICATION_JSON_UTF8)
						.content(objectMapper.writeValueAsString(request)))
				.andReturn().getResponse();

		// then
		then(informationTypeRepository).should(times(1)).findById(id);
		then(service).should(times(1)).validateRequest(request, true);
		then(informationTypeRepository).should(never()).save(any(InformationType.class));
		assertThat(response.getStatus()).isEqualTo(HttpStatus.BAD_REQUEST.value());
		assertThat(response.getContentAsString()).isEqualTo(objectMapper.writeValueAsString(validationErrors));
	}

	@Test
	public void deleteInformationTypeById_shouldSetElasticsearchStatusToBeDeleted() throws Exception {
		List<InformationType> informationTypeList = getInformationTypeList();
		Long id = informationTypeList.get(1).getId();
		assertThat(informationTypeList.get(1).getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_CREATED);

		// given
		given(informationTypeRepository.findById(id))
				.willReturn(Optional.of(informationTypeList.get(1)));


		// when
		MockHttpServletResponse response = mvc.perform(
				MockMvcRequestBuilders.delete(BASE_URI + "/" + id))
				.andReturn().getResponse();

		// then
		then(informationTypeRepository).should(times(1)).findById(id);
		then(informationTypeRepository).should(times(1)).save(informationTypeList.get(1));
		assertThat(informationTypeList.get(1).getElasticsearchStatus()).isEqualTo(ElasticsearchStatus.TO_BE_DELETED);
	}


	private List<InformationType> getInformationTypeList() {
		InformationType informationType_2 = InformationType.builder()
				.id(2L)
				.name("Test_2")
				.description("Test av addresse")
				.category("KONTAKTOPPLYSNINGER")
				.producer("SKATTEETATEN")
				.system("TPS")
				.personalData(true)
				.elasticsearchId(base64UUID())
				.elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
				.build();

		InformationType informationType_3 = InformationType.builder()
				.id(3L)
				.name("Test_3")
				.description("Test av arbeidsgiver")
				.category("ARBEIDSFORHOLD")
				.producer("ARBEIDSGIVER")
				.system("AA_REG")
				.personalData(true)
				.elasticsearchId(base64UUID())
				.elasticsearchStatus(ElasticsearchStatus.TO_BE_CREATED)
				.build();

		List<InformationType> list = new ArrayList<>();
		list.add(informationType);
		list.add(informationType_2);
		list.add(informationType_3);

		return list;
	}

}

