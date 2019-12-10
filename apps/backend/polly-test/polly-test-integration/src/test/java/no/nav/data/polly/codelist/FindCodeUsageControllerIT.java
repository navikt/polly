package no.nav.data.polly.codelist;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.FindCodeUsageResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static org.assertj.core.api.Assertions.assertThat;

public class FindCodeUsageControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private FindCodeUsageService findCodeUsageService;

    @Autowired
    private CodelistService codelistService;

    @Autowired
    private CodelistRepository codelistRepository;


    @BeforeEach
    void setUp() {
        codelistRepository.deleteAll();
        codelistService.refreshCache();
        createTestData();
    }

    @Nested
    class findByListNameAndCode {


        @ParameterizedTest
        @CsvSource({"PURPOSE,DAGPENGER,1", "DEPARTMENT,YTA,2", "SUB_DEPARTMENT,NAY,2", "GDPR_ARTICLE,ART61E,2", "NATIONAL_LAW,FTRL,2"})
        void findProcesses(String list, String code, int expectedCount) {
            ResponseEntity<FindCodeUsageResponse> response = restTemplate.exchange(String.format("/findcodeusage/%s/%s", list, code), HttpMethod.GET, HttpEntity.EMPTY, FindCodeUsageResponse.class);
            assertThat(response.getBody().getProcessResponses().size()).isEqualTo(expectedCount);
        }

        @ParameterizedTest
        @CsvSource({"PURPOSE,DAGPENGER,1,1", "GDPR_ARTICLE,ART92A,1,0", "NATIONAL_LAW,FTRL,2,2"})
        void findProcessesAndPolicy(String list, String code, int expectedCountProcess, int expectedCountPolicy) {
            ResponseEntity<FindCodeUsageResponse> response = restTemplate.exchange(String.format("/findcodeusage/%s/%s", list, code), HttpMethod.GET, HttpEntity.EMPTY, FindCodeUsageResponse.class);

            assertThat(response.getBody().getProcessResponses().size()).isEqualTo(expectedCountProcess);
            assertThat(response.getBody().getPolicyResponses().size()).isEqualTo(expectedCountPolicy);
        }

        @ParameterizedTest
        @CsvSource({"PURPOSE,DAGPENGER,1", "SUBJECT_CATEGORY,BRUKER,2", "GDPR_ARTICLE,ART61E,2", "NATIONAL_LAW,FTRL,2"})
        void findPolicies(String list, String code, int expectedCount) {
            ResponseEntity<FindCodeUsageResponse> response = restTemplate.exchange(String.format("/findcodeusage/%s/%s", list, code), HttpMethod.GET, HttpEntity.EMPTY, FindCodeUsageResponse.class);

            assertThat(response.getBody().getPolicyResponses().size()).isEqualTo(expectedCount);
        }

        @ParameterizedTest
        @CsvSource({"SENSITIVITY,POL,2", "SYSTEM,TPS,1", "CATEGORY,PERSONALIA,1", "SOURCE,SKATTEETATEN,1"})
        void findInformationTypes(String list, String code, int expectedCount) {
            ResponseEntity<FindCodeUsageResponse> response = restTemplate.exchange(String.format("/findcodeusage/%s/%s", list, code), HttpMethod.GET, HttpEntity.EMPTY, FindCodeUsageResponse.class);
            assertThat(response.getBody().getInformationTypeResponses().size()).isEqualTo(expectedCount);
        }
    }

//    @Nested
//    class findByRequests {
//
//
//        @ParameterizedTest
//        @CsvSource({"PURPOSE,DAGPENGER,1", "DEPARTMENT,YTA,2", "SUB_DEPARTMENT,NAY,2", "GDPR_ARTICLE,ART61E,2", "NATIONAL_LAW,FTRL,2"})
//        void findProcesses(String list, String code, int expectedCount) {
//
//            ResponseEntity<FindCodeUsageResponse> response = restTemplate.exchange("/findcodeusage", HttpMethod.GET, new HttpEntity<>(request), FindCodeUsageResponse.class);
//            assertThat(response.getBody().getProcessResponses().size()).isEqualTo(expectedCount);
//        }
//
//        @ParameterizedTest
//        @CsvSource({"PURPOSE,DAGPENGER,1,1", "GDPR_ARTICLE,ART92A,1,0", "NATIONAL_LAW,FTRL,2,2"})
//        void findProcessesAndPolicy(String list, String code, int expectedCountProcess, int expectedCountPolicy) {
//            ResponseEntity<FindCodeUsageResponse> response = restTemplate.exchange(String.format("/findcodeusage/%s/%s", list, code), HttpMethod.GET, HttpEntity.EMPTY, FindCodeUsageResponse.class);
//
//            assertThat(response.getBody().getProcessResponses().size()).isEqualTo(expectedCountProcess);
//            assertThat(response.getBody().getPolicyResponses().size()).isEqualTo(expectedCountPolicy);
//        }
//
//        @ParameterizedTest
//        @CsvSource({"PURPOSE,DAGPENGER,1", "SUBJECT_CATEGORY,BRUKER,2", "GDPR_ARTICLE,ART61E,2", "NATIONAL_LAW,FTRL,2"})
//        void findPolicies(String list, String code, int expectedCount) {
//            ResponseEntity<FindCodeUsageResponse> response = restTemplate.exchange(String.format("/findcodeusage/%s/%s", list, code), HttpMethod.GET, HttpEntity.EMPTY, FindCodeUsageResponse.class);
//
//            assertThat(response.getBody().getPolicyResponses().size()).isEqualTo(expectedCount);
//        }
//
//        @ParameterizedTest
//        @CsvSource({"SENSITIVITY,POL,2", "SYSTEM,TPS,1", "CATEGORY,PERSONALIA,1", "SOURCE,SKATTEETATEN,1"})
//        void findInformationTypes(String list, String code, int expectedCount) {
//            ResponseEntity<FindCodeUsageResponse> response = restTemplate.exchange(String.format("/findcodeusage/%s/%s", list, code), HttpMethod.GET, HttpEntity.EMPTY, FindCodeUsageResponse.class);
//            assertThat(response.getBody().getInformationTypeResponses().size()).isEqualTo(expectedCount);
//        }
//    }

    private void createTestData() {
        createCodelistsByRequests();

        InformationType sivilstand = createInformationType("SIVILSTAND", "POL", "TPS", "PERSONALIA", "SKATTEETATEN");
        InformationType arbeidsforhold = createInformationType("ARBEIDSFORHOLD", "POL", "AA_REG", "ARBEIDSFORHOLD", "ARBEIDSGIVER");
        informationTypeRepository.saveAll(List.of(sivilstand, arbeidsforhold));
        Process dagpengerSaksbehandling = createProcess("Saksbehandling", "DAGPENGER", "YTA", "NAY", List.of(createLegalBasis("ART61E", "FTRL", "§ 2-1"), createLegalBasis("ART92A", "FTRL", "§ 2-1")));
        Process dagpengerAnalyse = createProcess("Analyse", "BARNETRYGD", "YTA", "NAY", List.of(createLegalBasis("ART61E", "FTRL", "§ 12-4")));
        processRepository.saveAll(List.of(dagpengerSaksbehandling, dagpengerAnalyse));

        Policy dagpengerBruker = createPolicy("DAGPENGER", "BRUKER", List.of(createLegalBasis("ART61E", "FTRL", "§ 2-1")));
        Policy barnetrygdBruker = createPolicy("BARNETRYGD", "BRUKER", List.of(createLegalBasis("ART61E", "FTRL", "§ 2-1")));

        sivilstand.addPolicy(dagpengerBruker);
        sivilstand.addPolicy(barnetrygdBruker);
        arbeidsforhold.addPolicy(dagpengerBruker);
        dagpengerSaksbehandling.addPolicy(dagpengerBruker);
        dagpengerAnalyse.addPolicy(dagpengerBruker);
        dagpengerAnalyse.addPolicy(barnetrygdBruker);

        policyRepository.saveAll(List.of(dagpengerBruker, barnetrygdBruker));
    }

    private void createCodelistsByRequests() {
        List<CodelistRequest> requests = List.of(
                createCodelistRequest("CATEGORY", "PERSONALIA", "Personalia", "Personalia"),
                createCodelistRequest("CATEGORY", "ARBEIDSFORHOLD", "ARBEIDSFORHOLD", "Arbeidsforhold"),

                createCodelistRequest("DEPARTMENT", "YTA", "Ytelsesavdelingen", "Ytelsesavdelingen"),

                createCodelistRequest("GDPR_ARTICLE", "ART61E", "Art. 6(1)e - Allmennhetens interesse eller utøve offentlig myndighet", "6e"),
                createCodelistRequest("GDPR_ARTICLE", "ART92A", "Art. 9(2)a - Samtykke", "En virksomhet kan behandle særlige kategorier av personopplysninger dersom det er innhentet et gyldig samtykke fra personen det gjelder."),

                createCodelistRequest("NATIONAL_LAW", "FTRL", "Ftrl", "1997-02-28-19"),

                createCodelistRequest("PURPOSE", "DAGPENGER", "Dagpenger", "Behandle og vurdere rett til dagpenger som har til formål å gi delvis dekning for bortfall av arbeidsinntekt ved arbeidsløshet."),
                createCodelistRequest("PURPOSE", "BARNETRYGD", "Barnetrygd", "Behandle og vurdere rett til barnetrygd som ikke er gitt automatisk til dekning av utgifter til forsørgelse av barn."),

                createCodelistRequest("SENSITIVITY", "POL", "Personopplysning", "Personopplysning – GDPR art. 6"),

                createCodelistRequest("SOURCE", "SKATTEETATEN", "Skatteetaten", "Skatteetaten"),
                createCodelistRequest("SOURCE", "ARBEIDSGIVER", "Arbeidsgiver", "Arbeidsgiver"),

                createCodelistRequest("SUB_DEPARTMENT", "NAY", "NAV Arbeid og ytelser", "NAV Arbeid og ytelser"),

                createCodelistRequest("SUBJECT_CATEGORY", "BRUKER", "Bruker", "Bruker"),

                createCodelistRequest("SYSTEM", "TPS", "TPS", "PersondataSystem"),
                createCodelistRequest("SYSTEM", "AA_REG", "AA_REG", "Arbeidsgiver / Arbeidstaker register"));

        codelistService.save(requests);
    }
}