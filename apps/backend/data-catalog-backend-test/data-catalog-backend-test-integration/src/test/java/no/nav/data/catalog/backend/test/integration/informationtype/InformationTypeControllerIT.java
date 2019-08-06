package no.nav.data.catalog.backend.test.integration.informationtype;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.informationtype.*;
import no.nav.data.catalog.backend.test.component.elasticsearch.FixedElasticsearchContainer;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.junit.After;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.PostgreSQLContainer;

import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_DELETED;
import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.TO_BE_UPDATED;
import static no.nav.data.catalog.backend.test.integration.informationtype.TestdataInformationTypes.*;
import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {InformationTypeControllerIT.Initializer.class})
public class InformationTypeControllerIT {

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected InformationTypeRepository repository;

    @Autowired
    protected CodelistService codelistService;

	private static Map<ListName, Map<String, String>> codelists;

    @ClassRule
    public static PostgreSQLContainer postgreSQLContainer =
            (PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
                    .withDatabaseName("sampledb")
                    .withUsername("sampleuser")
                    .withPassword("samplepwd")
                    .withStartupTimeout(Duration.ofSeconds(600));

    @ClassRule
    public static FixedElasticsearchContainer container = new FixedElasticsearchContainer("docker.elastic.co/elasticsearch/elasticsearch-oss:6.4.1");

    @Before
    public void setUp() {
        repository.deleteAll();
        initializeCodelists();
    }

    @After
    public void cleanUp() {
        repository.deleteAll();
    }

    private void initializeCodelists() {
        codelists = CodelistService.codelists;
		codelists.get(ListName.CATEGORY).put("PERSONALIA", "Personalia");
		codelists.get(ListName.CATEGORY).put("ARBEIDSFORHOLD", "Arbeidsforhold");
		codelists.get(ListName.PRODUCER).put("SKATTEETATEN", "Skatteetaten");
		codelists.get(ListName.PRODUCER).put("BRUKER", "Bruker");
		codelists.get(ListName.PRODUCER).put("FOLKEREGISTERET", "Folkeregisteret");
		codelists.get(ListName.PRODUCER).put("ARBEIDSGIVER", "Arbeidsgiver");
		codelists.get(ListName.SYSTEM).put("AA-REG", "Arbeidsgiver / Arbeidstaker register");
		codelists.get(ListName.SYSTEM).put("TPS", "Tjenestebasert PersondataSystem");
    }

    @Test
    public void getInformationTypeById() {
        InformationType informationType = saveAnInformationType(createRequest());

		ResponseEntity<InformationTypeResponse> responseEntity = restTemplate.exchange(
				"/backend/informationtype/" + informationType.getId(), HttpMethod.GET, HttpEntity.EMPTY, InformationTypeResponse.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertInformationTypeResponse(responseEntity.getBody());
    }

    @Test
    public void getInformationTypeByName() {
        InformationType informationType = saveAnInformationType(createRequest());

		ResponseEntity<InformationTypeResponse> responseEntity = restTemplate.exchange(
				"/backend/informationtype/name/" + informationType.getName(), HttpMethod.GET, HttpEntity.EMPTY, InformationTypeResponse.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertInformationTypeResponse(responseEntity.getBody());

		responseEntity = restTemplate.exchange(
				"/backend/informationtype/name/" + informationType.getName().toUpperCase(),
				HttpMethod.GET, HttpEntity.EMPTY, InformationTypeResponse.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertInformationTypeResponse(responseEntity.getBody());

		responseEntity = restTemplate.exchange(
				"/backend/informationtype/name/" + informationType.getName()
						.toLowerCase(), HttpMethod.GET, HttpEntity.EMPTY, InformationTypeResponse.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertInformationTypeResponse(responseEntity.getBody());

		responseEntity = restTemplate.exchange(
				"/backend/informationtype/name/" + informationType.getName() + " ", HttpMethod.GET, HttpEntity.EMPTY, InformationTypeResponse.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertInformationTypeResponse(responseEntity.getBody());
	}

	private InformationType saveAnInformationType(InformationTypeRequest request) {
		return repository.save(new InformationType().convertFromRequest(request, false));
	}

	@Test
	public void get20FirstInformationTypes() {
		createInformationTypeTestData(30);

		ResponseEntity<RestResponsePage<InformationTypeResponse>> responseEntity = restTemplate.exchange("/backend/informationtype",
				HttpMethod.GET, HttpEntity.EMPTY, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(repository.findAll().size(), is(30));
		assertThat(responseEntity.getBody().getContent().size(), is(20));
		assertThat(responseEntity.getBody().getNumber(), is(0));
		assertThat(responseEntity.getBody().getSize(), is(20));
		assertThat(responseEntity.getBody().getTotalElements(), is(30L));
    }

	@Test
	public void get100InformationTypes() {
		createInformationTypeTestData(100);

        ResponseEntity<RestResponsePage<InformationTypeResponse>> responseEntity = restTemplate.exchange(
				"/backend/informationtype?page=0&pageSize=100", HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(repository.findAll().size(), is(100));
		assertThat(responseEntity.getBody().getContent().size(), is(100));
		assertThat(responseEntity.getBody().getNumber(), is(0));
		assertThat(responseEntity.getBody().getSize(), is(100));
		assertThat(responseEntity.getBody().getTotalElements(), is(100L));
	}

	@Test
	public void getLastPageWithInformationTypes() {
		createInformationTypeTestData(98);

		ResponseEntity<RestResponsePage<InformationTypeResponse>> responseEntity = restTemplate.exchange(
				"/backend/informationtype?page=4&pageSize=20", HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(repository.findAll().size(), is(98));
		assertThat(responseEntity.getBody().getContent().size(), is(18));
		assertThat(responseEntity.getBody().getNumber(), is(4));
		assertThat(responseEntity.getBody().getSize(), is(20));
		assertThat(responseEntity.getBody().getTotalElements(), is(98L));
	}

	@Test
	public void getInformationTypesSortedByIdInDescendingOrder() {
		createInformationTypeTestData(100);

		ResponseEntity<RestResponsePage<InformationTypeResponse>> responseEntity = restTemplate.exchange(
				"/backend/informationtype?sort=id,desc", HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
                });
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(repository.findAll().size(), is(100));
		assertThat(responseEntity.getBody().getContent().get(0).getName(), equalTo("InformationTypeName_nr_100"));
		assertThat(responseEntity.getBody().getContent().get(1).getName(), equalTo("InformationTypeName_nr_99"));
		assertThat(responseEntity.getBody().getNumber(), is(0));
		assertThat(responseEntity.getBody().getSize(), is(20));
		assertThat(responseEntity.getBody().getTotalElements(), is(100L));
    }

	@Test
	public void getAllInformationTypesThatHasTheNumberOneInTheName() {
		createInformationTypeTestData(100);

		ResponseEntity<RestResponsePage<InformationTypeResponse>> responseEntity = restTemplate.exchange(
				"/backend/informationtype?name=1&pageSize=30", HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(repository.findAll().size(), is(100));
		assertThat(responseEntity.getBody().getContent().size(), is(20));
		assertThat(responseEntity.getBody().getNumber(), is(0));
		assertThat(responseEntity.getBody().getSize(), is(30));
		assertThat(responseEntity.getBody().getTotalElements(), is(20L));
	}

	@Test
	public void getInformationTypeByFilterQuerys() {
		initializeDBForFilterQuery();

		ResponseEntity<RestResponsePage<InformationTypeResponse>> responseEntity = restTemplate.exchange("/backend/informationtype?name=Sivilstand",
				HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(repository.findAll().size(), is(3));
		assertThat(responseEntity.getBody().getContent().size(), is(1));
		assertThat(responseEntity.getBody().getNumber(), is(0));
		assertThat(responseEntity.getBody().getSize(), is(20));
		assertThat(responseEntity.getBody().getTotalElements(), is(1L));
		assertThat(responseEntity.getBody().getContent().get(0).getName(), equalTo("Sivilstand"));

		responseEntity = restTemplate.exchange("/backend/informationtype?description=begrepskatalog",
				HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().getContent().size(), is(2));
		assertThat(responseEntity.getBody().getTotalElements(), is(2L));
		assertThat(responseEntity.getBody().getContent().get(0).getName(), equalTo("Sivilstand"));
		assertThat(responseEntity.getBody().getContent().get(1).getName(), equalTo("Kjønn"));


		responseEntity = restTemplate.exchange("/backend/informationtype?personalData=false",
				HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().getContent().size(), is(1));
		assertThat(responseEntity.getBody().getTotalElements(), is(1L));
		assertThat(responseEntity.getBody().getContent().get(0).getName(), equalTo("Kjønn"));

		responseEntity = restTemplate.exchange("/backend/informationtype?category=PERSONALIA",
				HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().getContent().size(), is(2));
		assertThat(responseEntity.getBody().getTotalElements(), is(2L));
		assertThat(responseEntity.getBody().getContent().get(0).getName(), equalTo("Sivilstand"));
		assertThat(responseEntity.getBody().getContent().get(1).getName(), equalTo("Kjønn"));


		responseEntity = restTemplate.exchange("/backend/informationtype?system=aa-reg",
				HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().getContent().size(), is(2));
		assertThat(responseEntity.getBody().getTotalElements(), is(2L));
		assertThat(responseEntity.getBody().getContent().get(0).getName(), equalTo("Sivilstand"));
		assertThat(responseEntity.getBody().getContent().get(1).getName(), equalTo("Arbeidsforhold"));

		responseEntity = restTemplate.exchange("/backend/informationtype?producer=Folkeregisteret",
				HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().getContent().size(), is(2));
		assertThat(responseEntity.getBody().getTotalElements(), is(2L));
		assertThat(responseEntity.getBody().getContent().get(0).getName(), equalTo("Sivilstand"));
		assertThat(responseEntity.getBody().getContent().get(0).getProducer().size(), is(1));
		assertThat(responseEntity.getBody().getContent().get(1).getName(), equalTo("Kjønn"));
		assertThat(responseEntity.getBody().getContent().get(1).getProducer().size(), is(2));

		responseEntity = restTemplate.exchange("/backend/informationtype?producer=Folkeregisteret&sort=id,desc",
				HttpMethod.GET, null, new ParameterizedTypeReference<RestResponsePage<InformationTypeResponse>>() {
				});
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody().getContent().size(), is(2));
		assertThat(responseEntity.getBody().getTotalElements(), is(2L));
		assertThat(responseEntity.getBody().getContent().get(1).getName(), equalTo("Sivilstand"));
		assertThat(responseEntity.getBody().getContent().get(1).getProducer().size(), is(1));
		assertThat(responseEntity.getBody().getContent().get(0).getName(), equalTo("Kjønn"));
		assertThat(responseEntity.getBody().getContent().get(0).getProducer().size(), is(2));
	}


    @Test
    public void countInformationTypes() {
        createInformationTypeTestData(100);

        ResponseEntity<Long> responseEntity = restTemplate.exchange(
				"/backend/informationtype/count", HttpMethod.GET, null, Long.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(repository.findAll().size(), is(100));
        assertThat(responseEntity.getBody(), is(100L));
    }

    @Test
    public void countNoInformationTypes() {
        ResponseEntity<Long> responseEntity = restTemplate.exchange(
				"/backend/informationtype/count", HttpMethod.GET, null, Long.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(repository.findAll().size(), is(0));
        assertThat(responseEntity.getBody(), is(0L));
    }

    @Test
    public void createInformationType() {
        List<InformationTypeRequest> requests = List.of(createRequest());
        ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.POST, new HttpEntity<>(requests), String.class);
        assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
        assertThat(repository.findAll().size(), is(1));
		assertInformationType(repository.findByName("InformationName").get());
    }

	@Test
	public void createInformationType_shouldThrowValidationException_withEmptyListOfRequests() {
		List requests = Collections.emptyList();

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.POST, new HttpEntity<>(requests), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
		assertThat(responseEntity.getBody(), containsString("The request was not accepted because it is empty"));
	}

	@Test
	public void createInformationTypes_shouldThrowValidationErrors_withInvalidRequests() {
		List<InformationTypeRequest> requestsListWithEmtpyAndDuplicate = List.of(
				createRequest("Request_1"),
				createRequest("Request_2"),
				InformationTypeRequest.builder().build(),
				createRequest("Request_2"));

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.POST, new HttpEntity<>(requestsListWithEmtpyAndDuplicate), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
		assertThat(repository.findAll().size(), is(0));
	}

	@Test
	public void updateInformationTypes() {
		List<InformationTypeRequest> requests = List.of(createRequest("UPDATE_1"), createRequest("UPDATE_2"));
		ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.POST, new HttpEntity<>(requests), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(repository.findAll().size(), is(2));

		requests.forEach(request -> request.setDescription("Updated description"));
		ResponseEntity<List<InformationTypeResponse>> updatedResponseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.PUT, new HttpEntity<>(requests), new ParameterizedTypeReference<List<InformationTypeResponse>>() {
				});

		assertThat(updatedResponseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(repository.findAll().size(), is(2));
		assertThat(repository.findAll().get(0).getDescription(), is("Updated description"));
		assertThat(repository.findAll().get(1).getDescription(), is("Updated description"));
	}

	@Test
	public void updateInformationTypes_shouldReturnNotFound_withNonExistingInformationType() {
		createInformationTypeTestData(2);

		List<InformationTypeRequest> requests = List.of(
				createRequest("InformationTypeName_nr_1"),
				createRequest("InformationTypeName_nr_3"));

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.PUT, new HttpEntity<>(requests), String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
		assertThat(responseEntity.getBody(), containsString(
				"Request:2={nameNotFound=There is not an InformationType with the name InformationTypeName_nr_3 and therefore it cannot be updated}"));
	}

	@Test
	public void updateInformationTypes_shouldReturnBadRequest_withInvalidRequests() {
		createInformationTypeTestData(2);
		assertThat(repository.findAll().size(), is(2));

		List<InformationTypeRequest> updateRequestsWithEmptyRequest = List.of(
				createRequest("InformationTypeName_nr_2"),
				InformationTypeRequest.builder().build(),
				createRequest("InformationTypeName_nr_1"));

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.PUT, new HttpEntity<>(updateRequestsWithEmptyRequest), String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.BAD_REQUEST));
		assertThat(repository.findAll().size(), is(2));
	}

	//TODO: Is this method ever used?
	@Test
	public void updateOneInformationTypeById() {
		InformationTypeRequest request = createRequest();
		repository.save(new InformationType().convertFromRequest(request, false));
		assertThat(repository.findAll().size(), is(1));

		InformationType storedInformationType = repository.findByName("InformationName").get();
		request.setDescription("InformationDescription" + "UPDATED");
		ResponseEntity responseEntity = restTemplate.exchange(
				"/backend/informationtype/" + storedInformationType.getId(), HttpMethod.PUT, new HttpEntity<>(request), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(repository.findAll().size(), is(1));
		storedInformationType = repository.findByName("InformationName").get();
		assertThat(storedInformationType.getDescription(), is("InformationDescription" + "UPDATED"));
		assertThat(storedInformationType.getElasticsearchStatus(), is(TO_BE_UPDATED));
	}

	@Test
	public void deleteInformationTypeById() {
		List<InformationTypeRequest> requests = List.of(createRequest());
		ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.POST, new HttpEntity<>(requests), String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertThat(repository.findAll().size(), is(1));

		InformationType storedInformationType = repository.findByName("InformationName").get();
		responseEntity = restTemplate.exchange(
				"/backend/informationtype/" + storedInformationType.getId(), HttpMethod.DELETE, HttpEntity.EMPTY, String.class);
		assertThat(repository.findAll().size(), is(1));
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		storedInformationType = repository.findByName("InformationName").get();
		assertThat(storedInformationType.getElasticsearchStatus(), is(TO_BE_DELETED));
	}

	@Test
	public void deleteInformationTypeById_returnNotFound_whenNonExistingId() {
		long nonExistingId = 42L;
		ResponseEntity responseEntity = restTemplate.exchange(
				"/backend/informationtype/" + nonExistingId, HttpMethod.DELETE, HttpEntity.EMPTY, String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.NOT_FOUND));
		assertNull(responseEntity.getBody());
	}

    @Test
    public void createInformationType_shouldChangeFieldsInTheRequestToTheCorrectFormat() {
        InformationTypeRequest request = InformationTypeRequest.builder()
                .name("   Trimmed Name   ")
                .description(" Trimmed description ")
                .categoryCode(" perSonAlia  ")
				.systemCode(" aa-Reg ")
                .producerCode(List.of("skatteetaten", "  BruKer  "))
                .personalData(true)
                .build();

		ResponseEntity<String> responseEntity = restTemplate.exchange(
				"/backend/informationtype", HttpMethod.POST, new HttpEntity<>(List.of(request)), String.class);

		assertThat(responseEntity.getStatusCode(), is(HttpStatus.ACCEPTED));
		assertTrue(repository.findByName("Trimmed Name").isPresent());
		InformationType validatedInformationType = repository.findByName("Trimmed Name").get();

        assertThat(validatedInformationType.getName(), is("Trimmed Name"));
        assertThat(validatedInformationType.getDescription(), is("Trimmed description"));
        assertThat(validatedInformationType.getCategoryCode(), is("PERSONALIA"));
		assertThat(validatedInformationType.getSystemCode(), is("AA-REG"));
        assertThat(validatedInformationType.getProducerCode(), is("SKATTEETATEN, BRUKER"));
        assertTrue(validatedInformationType.isPersonalData());
    }

	static class Initializer
			implements ApplicationContextInitializer<ConfigurableApplicationContext> {
		public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
			TestPropertyValues.of(
					"spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
					"spring.datasource.username=" + postgreSQLContainer.getUsername(),
					"spring.datasource.password=" + postgreSQLContainer.getPassword()
			).applyTo(configurableApplicationContext.getEnvironment());
		}
	}

	private void assertInformationType(InformationType informationType) {
		assertThat(informationType.getProducerCode(), is("SKATTEETATEN, BRUKER"));
		assertThat(informationType.getSystemCode(), is("AA-REG"));
		assertThat(informationType.isPersonalData(), is(true));
		assertThat(informationType.getName(), is("InformationName"));
		assertThat(informationType.getDescription(), is("InformationDescription"));
		assertThat(informationType.getCategoryCode(), is("PERSONALIA"));
	}

	private void assertInformationTypeResponse(InformationTypeResponse response) {
		assertThat(response.getName(), equalTo("InformationName"));
		assertThat(response.getDescription(), equalTo("InformationDescription"));
		assertThat(response.getCategory().get("code"), equalTo("PERSONALIA"));
		assertThat(response.getCategory().get("description"), equalTo("Personalia"));
		assertThat(response.getProducer(), equalTo(List.of(
				Map.of("code", "SKATTEETATEN", "description", "Skatteetaten"),
				Map.of("code", "BRUKER", "description", "Bruker"))));
		assertThat(response.getSystem().get("code"), equalTo("AA-REG"));
		assertThat(response.getSystem().get("description"), equalTo("Arbeidsgiver / Arbeidstaker register"));
	}

	private void createInformationTypeTestData(int nrOfRows) {
		repository.saveAll(IntStream.rangeClosed(1, nrOfRows)
				.mapToObj(i -> new InformationType()
						.convertFromRequest(createRequest("InformationTypeName_nr_" + i), false))
				.collect(Collectors.toList()));
	}

	private InformationTypeRequest createRequest(String name) {
		return InformationTypeRequest.builder()
				.name(name)
				.description("InformationDescription")
				.categoryCode("PERSONALIA")
				.producerCode(List.of("SKATTEETATEN", "BRUKER"))
				.systemCode("AA-REG")
				.personalData(true)
				.build();
	}

    private InformationTypeRequest createRequest() {
		return createRequest("InformationName");
    }

	private void initializeDBForFilterQuery() {
		InformationTypeRequest sivilstandRequest = InformationTypeRequest.builder()
				.name("Sivilstand")
				.description("En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176")
				.categoryCode("PERSONALIA")
				.producerCode(List.of("Folkeregisteret"))
				.systemCode("AA-REG")
				.personalData(true)
				.build();
		InformationTypeRequest arbeidsforholdRequest = InformationTypeRequest.builder()
				.name("Arbeidsforhold")
				.description("Avtaleforhold hvor den ene part, arbeidstakeren, forplikter seg til å utføre arbeid mot lønn eller annen godtgjørelse for den annen part, arbeidsgiveren, i henhold til dennes ledelse.")
				.categoryCode("Arbeidsforhold")
				.producerCode(List.of("Arbeidsgiver"))
				.systemCode("AA-REG")
				.personalData(true)
				.build();
		InformationTypeRequest kjonnRequest = InformationTypeRequest.builder()
				.name("Kjønn")
				.description("TODO - mangler i begrepskatalogen og i MFNs begrepsoversikt")
				.categoryCode("PERSONALIA")
				.producerCode(List.of("FOLKEREGISTERET", "BRUKER"))
				.systemCode("TPS")
				.personalData(false)
				.build();
		sivilstandRequest.toUpperCaseAndTrim();
		arbeidsforholdRequest.toUpperCaseAndTrim();
		kjonnRequest.toUpperCaseAndTrim();

		repository.save(new InformationType().convertFromRequest(sivilstandRequest, false));
		repository.save(new InformationType().convertFromRequest(arbeidsforholdRequest, false));
		repository.save(new InformationType().convertFromRequest(kjonnRequest, false));
	}
}
