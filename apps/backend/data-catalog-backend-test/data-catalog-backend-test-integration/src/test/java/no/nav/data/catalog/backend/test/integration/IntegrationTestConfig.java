package no.nav.data.catalog.backend.test.integration;

import com.github.tomakehurst.wiremock.WireMockServer;
import com.github.tomakehurst.wiremock.http.ContentTypeHeader;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;

@SpringBootApplication(scanBasePackageClasses = {IntegrationTestConfig.class})
public class IntegrationTestConfig {
    @Bean
    public WireMockServer wireMockServer() {
        WireMockServer wireMockServer = new WireMockServer(
                wireMockConfig().port(9089));

        wireMockServer.stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("informationTypeId", equalTo("1") )
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody("{\"content\":[{\"policyId\":1,\"informationType\":{\"informationTypeId\":1,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person\"},\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}" +
                                               ",{\"policyId\":2,\"informationType\":{\"informationTypeId\":1,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person\"},\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}" +
                                  "],\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
        wireMockServer.stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("informationTypeId", equalTo("2"))
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody("{\"content\":[{\"policyId\":1,\"informationType\":{\"informationTypeId\":2,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}" +
                                ",{\"policyId\":2,\"informationType\":{\"informationTypeId\":2,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}" +
                                "],\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
        wireMockServer.stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("informationTypeId", equalTo("3"))
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody("{\"content\":[{\"policyId\":1,\"informationType\":{\"informationTypeId\":3,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}" +
                                ",{\"policyId\":2,\"informationType\":{\"informationTypeId\":3,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}" +
                                "],\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
        wireMockServer.stubFor(get(urlPathEqualTo("/policy/policy"))
                .withQueryParam("informationTypeId", equalTo("4"))
                .willReturn(aResponse().withStatus(HttpStatus.OK.value())
                        .withHeader(ContentTypeHeader.KEY, "application/json")
                        .withBody("{\"content\":[{\"policyId\":1,\"informationType\":{\"informationTypeId\":4,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"LB description\",\"purpose\":{\"code\":\"KTR\",\"description\":\"Kontroll\"}}" +
                                ",{\"policyId\":2,\"informationType\":{\"informationTypeId\":4,\"name\":\"Sivilstand\",\"description\":\"En overordnet kategori som beskriver en persons forhold til en annen person. Ref. til Begrepskatalog: https://jira.adeo.no/browse/BEGREP-176\"},\"legalBasisDescription\":\"Ftrl. § 11-20\",\"purpose\":{\"code\":\"AAP\",\"description\":\"Arbeidsavklaringspenger\"}}" +
                                "],\"pageable\":{\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"offset\":0,\"pageSize\":20,\"pageNumber\":0,\"unpaged\":false,\"paged\":true},\"last\":false,\"totalPages\":2,\"totalElements\":2,\"size\":10,\"number\":0,\"sort\":{\"sorted\":false,\"unsorted\":true,\"empty\":true},\"first\":true,\"numberOfElements\":2,\"empty\":false}")
                ));
        return wireMockServer;
    }

    @PostConstruct
    public void start() {
        wireMockServer().start();
    }

    @PreDestroy
    public void stop() {
        wireMockServer().stop();
    }
}
