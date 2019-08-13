package no.nav.data.catalog.backend.test.integration;

import com.github.tomakehurst.wiremock.http.ContentTypeHeader;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.test.component.PostgresTestContainer;
import no.nav.data.catalog.backend.test.integration.util.EnableWiremock;
import org.junit.ClassRule;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;

@EnableWiremock
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = {IntegrationTestConfig.class, AppStarter.class})
@ContextConfiguration(initializers = {PostgresTestContainer.Initializer.class})
public abstract class IntegrationTestBase {

    @ClassRule
    public static PostgresTestContainer postgreSQLContainer = PostgresTestContainer.getInstance();

    protected void policyStubbing() {
        stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("informationTypeId", equalTo("1"))
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody(
                                "{\"content\":[{\"policyId\":1,\"informationType\":{\"informationTypeId\":1,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person\"},\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}"
                                        +
                                        ",{\"policyId\":2,\"informationType\":{\"informationTypeId\":1,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person\"},\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}"
                                        +
                                        "],\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
        stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("informationTypeId", equalTo("2"))
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody(
                                "{\"content\":[{\"policyId\":1,\"informationType\":{\"informationTypeId\":2,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}"
                                        +
                                        ",{\"policyId\":2,\"informationType\":{\"informationTypeId\":2,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}"
                                        +
                                        "],\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
        stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("informationTypeId", equalTo("3"))
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody(
                                "{\"content\":[{\"policyId\":1,\"informationType\":{\"informationTypeId\":3,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}"
                                        +
                                        ",{\"policyId\":2,\"informationType\":{\"informationTypeId\":3,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}"
                                        +
                                        "],\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
        stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("informationTypeId", equalTo("4"))
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody(
                                "{\"content\":[{\"policyId\":1,\"informationType\":{\"informationTypeId\":4,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}"
                                        +
                                        ",{\"policyId\":2,\"informationType\":{\"informationTypeId\":4,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}"
                                        +
                                        "],\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
    }
}
