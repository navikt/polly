package no.nav.data.polly.codelist;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistUsageResponse;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Objects;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static org.assertj.core.api.Assertions.assertThat;

public class CodeUsageControllerIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;

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
    class findAllCodeUsageOfListname {

        @ParameterizedTest
        @CsvSource({"PURPOSE, 2", "DEPARTMENT,1", "SUB_DEPARTMENT,1", "GDPR_ARTICLE,2", "NATIONAL_LAW,1", "SUBJECT_CATEGORY,1", "SENSITIVITY,1", "SYSTEM,2", "CATEGORY,2",
                "SOURCE,2"})
        void shouldFindCodeUsage(String list, int expectedCodesInUse) {
            ResponseEntity<CodelistUsageResponse> response = restTemplate
                    .exchange(String.format("/codelist/usage/find/%s", list), HttpMethod.GET, HttpEntity.EMPTY, CodelistUsageResponse.class);

            assertThat(expectedCodesInUse).isEqualTo(Objects.requireNonNull(response.getBody()).getCodesInUse().stream().filter(CodeUsageResponse::isInUse).count());
        }
    }

    @Nested
    class findCodeUsageByListNameAndCode {

        @ParameterizedTest
        @CsvSource({"PURPOSE,DAGPENGER,1", "DEPARTMENT,YTA,2", "SUB_DEPARTMENT,NAY,2", "GDPR_ARTICLE,ART61E,2", "NATIONAL_LAW,FTRL,2"})
        void findProcesses(String list, String code, int expectedCountProcess) {
            var response = getForListAndCode(list, code);

            assertThat(expectedCountProcess).isEqualTo(countProcesses(response));
        }

        @ParameterizedTest
        @CsvSource({"PURPOSE,DAGPENGER,1,1", "GDPR_ARTICLE,ART92A,1,0", "NATIONAL_LAW,FTRL,2,2"})
        void findProcessesAndPolicy(String list, String code, int expectedCountProcess, int expectedCountPolicy) {
            var response = getForListAndCode(list, code);

            assertThat(expectedCountProcess).isEqualTo(countProcesses(response));
            assertThat(expectedCountPolicy).isEqualTo(countPolicies(response));
        }

        @ParameterizedTest
        @CsvSource({"PURPOSE,DAGPENGER,1", "SUBJECT_CATEGORY,BRUKER,2", "GDPR_ARTICLE,ART61E,2", "NATIONAL_LAW,FTRL,2"})
        void findPolicies(String list, String code, int expectedCountPolicy) {
            assertThat(expectedCountPolicy).isEqualTo(countPolicies(getForListAndCode(list, code)));
        }

        @ParameterizedTest
        @CsvSource({"SENSITIVITY,POL,2", "SYSTEM,TPS,1", "CATEGORY,PERSONALIA,1", "SOURCE,SKATTEETATEN,1"})
        void findInformationTypes(String list, String code, int expectedCountInformationTypes) {
            assertThat(expectedCountInformationTypes).isEqualTo(countInformationTypes(getForListAndCode(list, code)));
        }

        @ParameterizedTest
        @CsvSource({"SOURCE,SKATTEETATEN,1", "SOURCE,ARBEIDSGIVER,0", "GDPR_ARTICLE,ART61E,1", "GDPR_ARTICLE,ART92A,0", "NATIONAL_LAW,FTRL,1", "NATIONAL_LAW,OTHER_LAW,0"})
        void findDisclosures(String list, String code, int expectedCountDisclosures) {
            assertThat(expectedCountDisclosures).isEqualTo(countDisclosures(getForListAndCode(list, code)));
        }

        @ParameterizedTest
        @CsvSource({"PURPOSE,NOT_FOUND", "DEPARTMENT,NOT_FOUND", "NATIONAL_LAW,NOT_FOUND", "SUBJECT_CATEGORY,NOT_FOUND", "SENSITIVITY,NOT_FOUND"})
        void shouldNotFindCodeUsage(String list, String code) {
            assertThat(HttpStatus.NOT_FOUND).isEqualTo(getForListAndCode(list, code).getStatusCode());
        }

        @ParameterizedTest
        @CsvSource({"PURPOSE,BARNETRYGD,0,1,1", "DEPARTMENT,YTA,0,0,2", "SUB_DEPARTMENT,NAY,0,0,2", "GDPR_ARTICLE,ART92A,0,0,1", "NATIONAL_LAW,FTRL,0,2,2",
                "SUBJECT_CATEGORY,BRUKER,0,2,0", "SENSITIVITY,POL,2,0,0", "SYSTEM,AA_REG,1,0,0", "CATEGORY,ARBEIDSFORHOLD,1,0,0", "SOURCE,SKATTEETATEN,1,0,0"})
        void shouldFindCodeUsage(String list, String code, int expectedCountInformationTypes, int expectedCountPolicy, int expectedCountProcess) {
            ResponseEntity<CodeUsageResponse> response = getForListAndCode(list, code);

            assertThat(expectedCountInformationTypes).isEqualTo(countInformationTypes(response));
            assertThat(expectedCountPolicy).isEqualTo(countPolicies(response));
            assertThat(expectedCountProcess).isEqualTo(countProcesses(response));
        }

        private ResponseEntity<CodeUsageResponse> getForListAndCode(String list, String code) {
            return restTemplate.getForEntity("/codelist/usage/find/{list}/{code}", CodeUsageResponse.class, list, code);
        }
    }

    private void createTestData() {
        createCodelistsByRequests();

        InformationType sivilstand = createInformationType("SIVILSTAND", "POL", "TPS", "PERSONALIA", "SKATTEETATEN");
        InformationType arbeidsforhold = createInformationType("ARBEIDSFORHOLD", "POL", "AA_REG", "ARBEIDSFORHOLD", "ARBEIDSGIVER");
        informationTypeRepository.saveAll(List.of(sivilstand, arbeidsforhold));

        Process dagpengerSaksbehandling = createProcess("Saksbehandling", "DAGPENGER", "YTA", "NAY",
                List.of(createLegalBasis("ART61E", "FTRL", "§ 2-1"), createLegalBasis("ART92A", "FTRL", "§ 2-1")));
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

        var disclosure = createDisclosure("SKATTEETATEN");
        disclosure.addInformationType(arbeidsforhold);
        disclosureRepository.save(disclosure);
    }

    private void createCodelistsByRequests() {
        List<CodelistRequest> requests = List.of(
                createCodelistRequest("CATEGORY", "PERSONALIA"),
                createCodelistRequest("CATEGORY", "ARBEIDSFORHOLD"),

                createCodelistRequest("DEPARTMENT", "YTA"),
                createCodelistRequest("DEPARTMENT", "OTHER_DEP"),

                createCodelistRequest("GDPR_ARTICLE", "ART61E"),
                createCodelistRequest("GDPR_ARTICLE", "ART92A"),

                createCodelistRequest("NATIONAL_LAW", "FTRL"),
                createCodelistRequest("NATIONAL_LAW", "OTHER_LAW"),

                createCodelistRequest("PURPOSE", "DAGPENGER"),
                createCodelistRequest("PURPOSE", "BARNETRYGD"),
                createCodelistRequest("PURPOSE", "OTHER_PURP"),

                createCodelistRequest("SENSITIVITY", "POL"),
                createCodelistRequest("SENSITIVITY", "OTHER_SENS"),

                createCodelistRequest("SOURCE", "SKATTEETATEN"),
                createCodelistRequest("SOURCE", "ARBEIDSGIVER"),

                createCodelistRequest("SUB_DEPARTMENT", "NAY"),

                createCodelistRequest("SUBJECT_CATEGORY", "BRUKER"),
                createCodelistRequest("SUBJECT_CATEGORY", "OTHER_SUBCAT"),

                createCodelistRequest("SYSTEM", "TPS"),
                createCodelistRequest("SYSTEM", "AA_REG"));

        codelistService.save(requests);
    }

    private int countInformationTypes(ResponseEntity<CodeUsageResponse> response) {
        return Objects.requireNonNull(response.getBody()).getInformationTypes().size();
    }

    private int countPolicies(ResponseEntity<CodeUsageResponse> response) {
        return Objects.requireNonNull(response.getBody()).getPolicies().size();
    }

    private int countProcesses(ResponseEntity<CodeUsageResponse> response) {
        return Objects.requireNonNull(response.getBody()).getProcesses().size();
    }

    private int countDisclosures(ResponseEntity<CodeUsageResponse> response) {
        return Objects.requireNonNull(response.getBody()).getDisclosures().size();
    }
}