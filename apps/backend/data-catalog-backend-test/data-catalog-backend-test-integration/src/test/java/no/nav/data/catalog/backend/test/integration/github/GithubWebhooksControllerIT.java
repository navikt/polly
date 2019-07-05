package no.nav.data.catalog.backend.test.integration.github;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.github.GithubConsumer;
import no.nav.data.catalog.backend.app.github.GithubWebhooksController;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.poldatasett.PolDatasett;
import no.nav.data.catalog.backend.app.poldatasett.PolDatasettRepository;
import no.nav.data.catalog.backend.test.integration.IntegrationTestConfig;
import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.event.PushPayload;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.testcontainers.containers.PostgreSQLContainer;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {IntegrationTestConfig.class, AppStarter.class})
@ActiveProfiles("itest")
@ContextConfiguration(initializers = {GithubWebhooksControllerIT.Initializer.class})
public class GithubWebhooksControllerIT {

    public static final String URL = "/webhooks";
    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected InformationTypeRepository repository;

    @Autowired
    protected PolDatasettRepository polDatasettRepository;
    @Value("github.webhooks.secret")
    private String githubSecret;
    private HmacUtils hmacUtils;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Autowired
    protected CodelistService codelistService;

    private String head = "821cd53c03fa042c2a32f0c73ff5612c0a458143";
    private String before = "dbe83db262b1fd082e5cf90053f6196127976e7f";

    @ClassRule
    public static PostgreSQLContainer postgreSQLContainer =
            (PostgreSQLContainer) new PostgreSQLContainer("postgres:10.4")
                    .withDatabaseName("sampledb")
                    .withUsername("sampleuser")
                    .withPassword("samplepwd")
                    .withStartupTimeout(Duration.ofSeconds(600));

    @Before
    public void setUp() {
        repository.deleteAll();
        intializeCodelists();
        hmacUtils = new HmacUtils(HmacAlgorithms.HMAC_SHA_1, githubSecret);

        polDatasettRepository.save(new PolDatasett(before));

        repository.save(InformationType.builder()
                .name("removed").description("desc").systemCode("PESYS")
                .elasticsearchStatus(ElasticsearchStatus.SYNCED).producerCode("BRUKER")
                .categoryCode("PERSONALIA").build());
        repository.save(InformationType.builder()
                .name("modified_removed").description("desc").systemCode("PESYS")
                .elasticsearchStatus(ElasticsearchStatus.SYNCED).producerCode("BRUKER")
                .categoryCode("PERSONALIA").build());
        repository.save(InformationType.builder()
                .name("modified_changed").description("desc").systemCode("PESYS")
                .elasticsearchStatus(ElasticsearchStatus.SYNCED).producerCode("BRUKER")
                .categoryCode("PERSONALIA").build());
    }

    private void intializeCodelists() {
        Map<ListName, Map<String, String>> codelists = CodelistService.codelists;
        codelists.get(ListName.CATEGORY).put("PERSONALIA", "Personalia");
        codelists.get(ListName.CATEGORY).put("INNTEKT_YTELSER", "Inntekt, trygde- og pensjonsytelser");
        codelists.get(ListName.PRODUCER).put("SKATTEETATEN", "Skatteetaten");
        codelists.get(ListName.PRODUCER).put("BRUKER", "Bruker");
        codelists.get(ListName.PRODUCER).put("UTLENDINGSDIREKTORATET", "Utlendingsdirektoratet");
        codelists.get(ListName.SYSTEM).put("TPS", "Tjenestebasert PersondataSystem");
        codelists.get(ListName.SYSTEM).put("PESYS", "Pensjonssystem");
        codelists.get(ListName.SYSTEM).put("INFOTRYGD", "System for saksbehandling av ytelser og trygd");
        codelists.get(ListName.SYSTEM).put("INST", "Institusjonsopphold");
        codelists.get(ListName.SYSTEM).put("ARENA", "Arbeidsrelatert saksbehandlingsystem");
    }

    @Test
    public void compareAndUpdateOk() {
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                URL, HttpMethod.POST, createRequest(), String.class);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
        assertThat(repository.findAll().size(), is(5));

        Optional<InformationType> added = repository.findByName("added");
        Optional<InformationType> removed = repository.findByName("removed");
        Optional<InformationType> modifiedRemoved = repository.findByName("modified_removed");
        Optional<InformationType> modifiedChanged = repository.findByName("modified_changed");
        Optional<InformationType> modifiedAdded = repository.findByName("modified_added");

        assertTrue(added.isPresent());
        assertTrue(removed.isPresent());
        assertTrue(modifiedAdded.isPresent());
        assertTrue(modifiedChanged.isPresent());
        assertTrue(modifiedRemoved.isPresent());

        assertThat(added.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_CREATED));
        assertThat(removed.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_DELETED));
        assertThat(modifiedAdded.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_CREATED));
        assertThat(modifiedChanged.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_UPDATED));
        assertThat(modifiedRemoved.get().getElasticsearchStatus(), is(ElasticsearchStatus.TO_BE_DELETED));

        assertThat(polDatasettRepository.findFirstByOrderByIdDesc().get().getGithubSha(), is(head));
    }

    private HttpEntity<String> createRequest() {
        PushPayload request = new PushPayload();
        request.setHead(head);
        request.setBefore(before);
        request.setSize(1);
        request.setRef(GithubConsumer.REFS_HEADS_MASTER);
        String payload = JsonUtils.toJson(request);

        HttpHeaders headers = new HttpHeaders();
        headers.add(GithubWebhooksController.HEADER_GITHUB_EVENT, "PushEvent");
        headers.add(GithubWebhooksController.HEADER_GITHUB_ID, "123");
        headers.add(GithubWebhooksController.HEADER_GITHUB_SIGNATURE, "sha1=" + hmacUtils.hmacHex(payload));

        return new HttpEntity<>(payload, headers);
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
}
