package no.nav.data.polly.codelist;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistUsageResponse;
import no.nav.data.polly.codelist.dto.ReplaceCodelistRequest;
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
                "THIRD_PARTY,2", "TRANSFER_GROUNDS_OUTSIDE_EU,2"})
        void shouldFindCodeUsage(String list, int expectedCodesInUse) {
            ResponseEntity<CodelistUsageResponse> response = restTemplate
                    .exchange(String.format("/codelist/usage/find/%s", list), HttpMethod.GET, HttpEntity.EMPTY, CodelistUsageResponse.class);

            assertThat(
                    Objects.requireNonNull(response.getBody()).getCodesInUse().stream().filter(CodeUsageResponse::isInUse).count()
            ).isEqualTo(expectedCodesInUse);
        }
    }

    @Nested
    class findCodeUsageByListNameAndCode {

        @ParameterizedTest
        @CsvSource({"PURPOSE,DAGPENGER,1", "DEPARTMENT,YTA,2", "SUB_DEPARTMENT,NAY,2", "GDPR_ARTICLE,ART61E,2", "NATIONAL_LAW,FTRL,2",
                "THIRD_PARTY,SKATTEETATEN,1", "TRANSFER_GROUNDS_OUTSIDE_EU,APPROVED_THIRD_COUNTRY,1"})
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
        @CsvSource({"SENSITIVITY,POL,2", "SYSTEM,TPS,1", "CATEGORY,PERSONALIA,1", "THIRD_PARTY,SKATTEETATEN,1"})
        void findInformationTypes(String list, String code, int expectedCountInformationTypes) {
            assertThat(expectedCountInformationTypes).isEqualTo(countInformationTypes(getForListAndCode(list, code)));
        }

        @ParameterizedTest
        @CsvSource({"THIRD_PARTY,SKATTEETATEN,1", "THIRD_PARTY,ARBEIDSGIVER,0", "GDPR_ARTICLE,ART61E,1", "GDPR_ARTICLE,ART92A,0", "NATIONAL_LAW,FTRL,1",
                "NATIONAL_LAW,OTHER_LAW,0"})
        void findDisclosures(String list, String code, int expectedCountDisclosures) {
            assertThat(expectedCountDisclosures).isEqualTo(countDisclosures(getForListAndCode(list, code)));
        }

        @ParameterizedTest
        @CsvSource({"SUBJECT_CATEGORY,BRUKER,1", "SUBJECT_CATEGORY,OTHER_SUBCAT,0"})
        void findDocuments(String list, String code, int expectedCountDisclosures) {
            assertThat(expectedCountDisclosures).isEqualTo(countDocuments(getForListAndCode(list, code)));
        }

        @ParameterizedTest
        @CsvSource({"PURPOSE,NOT_FOUND", "DEPARTMENT,NOT_FOUND", "NATIONAL_LAW,NOT_FOUND", "SUBJECT_CATEGORY,NOT_FOUND", "SENSITIVITY,NOT_FOUND",
                "TRANSFER_GROUNDS_OUTSIDE_EU,NOT_FOUND"})
        void shouldNotFindCodeUsage(String list, String code) {
            assertThat(HttpStatus.NOT_FOUND).isEqualTo(getForListAndCode(list, code).getStatusCode());
        }

        @ParameterizedTest
        @CsvSource({"PURPOSE,BARNETRYGD,0,1,1", "DEPARTMENT,YTA,0,0,2", "SUB_DEPARTMENT,NAY,0,0,2", "GDPR_ARTICLE,ART92A,0,0,1", "NATIONAL_LAW,FTRL,0,2,2",
                "SUBJECT_CATEGORY,BRUKER,0,2,0", "SENSITIVITY,POL,2,0,0", "SYSTEM,AA_REG,1,0,1", "SYSTEM,TPS,1,0,1", "CATEGORY,ARBEIDSFORHOLD,1,0,0",
                "THIRD_PARTY,SKATTEETATEN,1,0,1", "TRANSFER_GROUNDS_OUTSIDE_EU,APPROVED_THIRD_COUNTRY,0,0,1"})
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

    @Nested
    class replaceCodelist {

        @ParameterizedTest
        @CsvSource({"PURPOSE,DAGPENGER,0,1,1,0,0", "CATEGORY,PERSONALIA,1,0,0,0,0",
                "DEPARTMENT,YTA,0,0,2,0,0", "SUB_DEPARTMENT,NAY,0,0,2,0,0",
                "SENSITIVITY,POL,2,0,0,0,0", "THIRD_PARTY,SKATTEETATEN,1,0,1,1,0",
                "SUBJECT_CATEGORY,BRUKER,0,2,0,0,1", "SYSTEM,TPS,1,0,1,0,0",
                "NATIONAL_LAW,FTRL,0,2,2,1,0", "GDPR_ARTICLE,ART61E,0,2,2,1,0",
                "TRANSFER_GROUNDS_OUTSIDE_EU,APPROVED_THIRD_COUNTRY,0,0,1,0,0"
        })
        void replaceCodelistUsage(String list, String code, int informationTypes, int policies, int processes, int disclosures, int documents) {
            String newCode = "REPLACECODE";
            codelistService.save(List.of(createCodelistRequest(list, newCode)));

            var noactions = replaceCode(list, newCode, code);
            assertThat(noactions.isInUse()).isFalse();

            var replace = replaceCode(list, code, newCode);
            assertThat(replace.isInUse()).isTrue();
            assertThat(replace.getInformationTypes()).hasSize(informationTypes);
            assertThat(replace.getPolicies()).hasSize(policies);
            assertThat(replace.getProcesses()).hasSize(processes);
            assertThat(replace.getDisclosures()).hasSize(disclosures);
            assertThat(replace.getDocuments()).hasSize(documents);

            var replaceSecondRun = replaceCode(list, code, newCode);
            assertThat(replaceSecondRun.isInUse()).isFalse();
        }

        private CodeUsageResponse replaceCode(String list, String code, String newCode) {
            ResponseEntity<CodeUsageResponse> response = restTemplate
                    .postForEntity("/codelist/usage/replace", new ReplaceCodelistRequest(list, code, newCode), CodeUsageResponse.class);
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody()).isNotNull();
            return response.getBody();
        }
    }

    private void createTestData() {
        createCodelistsByRequests();

        InformationType sivilstand = createInformationType("SIVILSTAND", "POL", "TPS", "PERSONALIA", "SKATTEETATEN");
        InformationType arbeidsforhold = createInformationType("ARBEIDSFORHOLD", "POL", "AA_REG", "ARBEIDSFORHOLD", "ARBEIDSGIVER");
        informationTypeRepository.saveAll(List.of(sivilstand, arbeidsforhold));

        Process dagpengerSaksbehandling = createProcess("Saksbehandling", "DAGPENGER", "YTA", "NAY",
                List.of(createLegalBasis("ART61E", "FTRL", "§ 2-1"), createLegalBasis("ART92A", "FTRL", "§ 2-1")), "TPS", "SKATTEETATEN", "OTHER");
        Process dagpengerAnalyse = createProcess("Analyse", "BARNETRYGD", "YTA", "NAY", List.of(createLegalBasis("ART61E", "FTRL", "§ 12-4")), "AA_REG", "ARBEIDSGIVER",
                "APPROVED_THIRD_COUNTRY");
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

        var disclosure = createDisclosure("SKATTEETATEN", "ART61E", "FTRL");
        var document = createDocument("BRUKER", sivilstand.getId());
        disclosureRepository.save(disclosure);
        documentRepository.save(document);
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

                createCodelistRequest("THIRD_PARTY", "SKATTEETATEN"),
                createCodelistRequest("THIRD_PARTY", "ARBEIDSGIVER"),

                createCodelistRequest("SUB_DEPARTMENT", "NAY"),

                createCodelistRequest("SUBJECT_CATEGORY", "BRUKER"),
                createCodelistRequest("SUBJECT_CATEGORY", "OTHER_SUBCAT"),

                createCodelistRequest("SYSTEM", "TPS"),
                createCodelistRequest("SYSTEM", "AA_REG"),

                createCodelistRequest("TRANSFER_GROUNDS_OUTSIDE_EU", "APPROVED_THIRD_COUNTRY"),
                createCodelistRequest("TRANSFER_GROUNDS_OUTSIDE_EU", "OTHER"));

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

    private int countDocuments(ResponseEntity<CodeUsageResponse> response) {
        return Objects.requireNonNull(response.getBody()).getDocuments().size();
    }
}