package no.nav.data.polly.locking;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.sub.AffiliationRequest;
import no.nav.data.polly.processor.dto.ProcessorRequest;
import no.nav.data.polly.processor.dto.ProcessorResponse;
import no.nav.data.polly.test.TestRestTemplate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifiserer ekte optimistisk låsing: to oppdateringer basert på samme leste versjon.
 * Den første skal gå bra, den andre skal gi HTTP 409 CONFLICT.
 */
class OptimisticLockingIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void processUpdateWithStaleVersionGives409() {
        ResponseEntity<ProcessResponse> created = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("lockprocess").purpose("AAP").build(), ProcessResponse.class);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(created.getBody()).isNotNull();

        String id = created.getBody().getId().toString();
        Integer versionReadByBothClients = created.getBody().getVersion();
        assertThat(versionReadByBothClients).isNotNull();

        // Klient A oppdaterer med versjonen begge leste -> OK
        ProcessRequest updateA = ProcessRequest.builder().id(id).name("lockprocess").purpose("AAP")
                .affiliation(AffiliationRequest.builder().department("dep").build())
                .version(versionReadByBothClients)
                .build();
        ResponseEntity<ProcessResponse> respA = restTemplate
                .exchange("/process/{id}", HttpMethod.PUT, new HttpEntity<>(updateA), ProcessResponse.class, id);
        assertThat(respA.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(respA.getBody()).isNotNull();
        // Hibernate har økt version, og klienten får den nye verdien tilbake
        assertThat(respA.getBody().getVersion()).isEqualTo(versionReadByBothClients + 1);

        // Klient B oppdaterer med den samme (nå utdaterte) versjonen -> 409
        ProcessRequest updateB = ProcessRequest.builder().id(id).name("lockprocess").purpose("AAP")
                .affiliation(AffiliationRequest.builder().department("aot").build())
                .version(versionReadByBothClients)
                .build();
        ResponseEntity<String> respB = restTemplate
                .exchange("/process/{id}", HttpMethod.PUT, new HttpEntity<>(updateB), String.class, id);
        assertThat(respB.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);

        // Klient A sin endring skal ikke være overskrevet
        ResponseEntity<ProcessResponse> after = restTemplate.getForEntity("/process/{id}", ProcessResponse.class, id);
        assertThat(after.getBody()).isNotNull();
        assertThat(after.getBody().getAffiliation().getDepartment().getCode()).isEqualTo("DEP");
        assertThat(after.getBody().getVersion()).isEqualTo(versionReadByBothClients + 1);
    }

    @Test
    void processorUpdateWithStaleVersionGives409() {
        ResponseEntity<ProcessorResponse> created = restTemplate
                .postForEntity("/processor", createProcessorRequest(), ProcessorResponse.class);
        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(created.getBody()).isNotNull();

        String id = created.getBody().getId().toString();
        Integer staleVersion = created.getBody().getVersion();
        assertThat(staleVersion).isNotNull();

        ProcessorRequest first = createProcessorRequest();
        first.setId(id);
        first.setName("first update");
        first.setVersion(staleVersion);
        ResponseEntity<ProcessorResponse> resp1 = restTemplate
                .exchange("/processor/{id}", HttpMethod.PUT, new HttpEntity<>(first), ProcessorResponse.class, id);
        assertThat(resp1.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp1.getBody()).isNotNull();
        assertThat(resp1.getBody().getVersion()).isEqualTo(staleVersion + 1);

        ProcessorRequest second = createProcessorRequest();
        second.setId(id);
        second.setName("second update");
        second.setVersion(staleVersion);
        ResponseEntity<String> resp2 = restTemplate
                .exchange("/processor/{id}", HttpMethod.PUT, new HttpEntity<>(second), String.class, id);
        assertThat(resp2.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void informationTypeUpdateWithStaleVersionGives409() {
        var infoType = createAndSaveInformationType();
        String id = infoType.getId().toString();

        ResponseEntity<InformationTypeResponse> read = restTemplate
                .getForEntity("/informationtype/{id}", InformationTypeResponse.class, id);
        assertThat(read.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(read.getBody()).isNotNull();
        Integer staleVersion = read.getBody().getVersion();
        assertThat(staleVersion).isNotNull();

        InformationTypeRequest first = informationTypeRequest(id, "Navn A", staleVersion);
        ResponseEntity<InformationTypeResponse> resp1 = restTemplate
                .exchange("/informationtype/{id}", HttpMethod.PUT, new HttpEntity<>(first), InformationTypeResponse.class, id);
        assertThat(resp1.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp1.getBody()).isNotNull();
        assertThat(resp1.getBody().getVersion()).isEqualTo(staleVersion + 1);

        InformationTypeRequest second = informationTypeRequest(id, "Navn B", staleVersion);
        ResponseEntity<String> resp2 = restTemplate
                .exchange("/informationtype/{id}", HttpMethod.PUT, new HttpEntity<>(second), String.class, id);
        assertThat(resp2.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void updateWithoutVersionIsStillAccepted() {
        // Bakoverkompatibilitet: klienter som ikke sender version får fortsatt utført oppdateringen,
        // men er kun beskyttet av Hibernate sin versjonssjekk ved flush.
        ResponseEntity<ProcessResponse> created = restTemplate
                .postForEntity("/process", ProcessRequest.builder().name("noversionprocess").purpose("AAP").build(), ProcessResponse.class);
        assertThat(created.getBody()).isNotNull();
        String id = created.getBody().getId().toString();

        ProcessRequest update = ProcessRequest.builder().id(id).name("noversionprocess").purpose("AAP").build();
        ResponseEntity<ProcessResponse> resp = restTemplate
                .exchange("/process/{id}", HttpMethod.PUT, new HttpEntity<>(update), ProcessResponse.class, id);
        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    private InformationTypeRequest informationTypeRequest(String id, String name, Integer version) {
        return InformationTypeRequest.builder()
                .id(id)
                .name(name)
                .description("desc")
                .term("term")
                .sensitivity("POL")
                .orgMaster("TPS")
                .categories(java.util.List.of("PERSONALIA"))
                .sources(java.util.List.of("SKATT"))
                .keywords(java.util.List.of())
                .version(version)
                .build();
    }
}
