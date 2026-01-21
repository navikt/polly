package no.nav.data.polly.codelist;

import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.codelist.commoncode.dto.CommonCodeResponse;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.AllCodelistResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelist;
import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static no.nav.data.polly.codelist.CodelistUtils.createNrOfCodelistRequests;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CodelistControllerIT extends IntegrationTestBase {

    private static final String ERROR_IMMUTABLE_CODELIST = "%s is an immutable type of codelist. For amendments, please contact team #dataplatform";

    @Autowired
    private CodelistRepository repository;

    @Autowired
    private CodelistService service;

    @AfterEach
    void cleanUp() {
        repository.deleteAll();
    }

    @Nested
    class Get {

        @Test
        void findAll_shouldReturnAllCodelists() {
            AllCodelistResponse body = webTestClient.get()
                    .uri("/codelist")
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(AllCodelistResponse.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).isNotNull();
            assertThat(body.getCodelist()).hasSize(ListName.values().length);

            Arrays.stream(ListName.values())
                    .forEach(listName -> assertThat(body.getCodelist().get(listName))
                            .containsAll(CodelistResponse.convertToCodelistResponses(CodelistStaticService.getCodelists(listName))));
        }

        @Test
        void getCodelistByListName() {
            List<CodelistResponse> body = webTestClient.get()
                    .uri("/codelist/THIRD_PARTY")
                    .exchange()
                    .expectStatus().isOk()
                    .expectBodyList(CodelistResponse.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).isNotNull();
            assertThat(body).isEqualTo(CodelistResponse.convertToCodelistResponses(CodelistStaticService.getCodelists(ListName.THIRD_PARTY)));
        }

        @Test
        void getByListNameAndCode() {
            CodelistCache.set(createCodelist(ListName.THIRD_PARTY, "TEST_CODE"));

            CodelistResponse body = webTestClient.get()
                    .uri("/codelist/THIRD_PARTY/TEST_CODE")
                    .exchange()
                    .expectStatus().isOk()
                    .expectBody(CodelistResponse.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).isNotNull();
            assertThat(body.getDescription()).isEqualTo(CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "TEST_CODE").getDescription());
        }

        @Test
        void getAllCountries() {
            List<CommonCodeResponse> res = webTestClient.get()
                    .uri("/codelist/countries")
                    .exchange()
                    .expectStatus().isOk()
                    .expectBodyList(CommonCodeResponse.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(res).isNotNull();
            assertThat(res).containsExactly(CommonCodeResponse.builder()
                    .code("DNK")
                    .description("DANMARK")
                    .validFrom(LocalDate.of(1900, 1, 1))
                    .validTo(LocalDate.of(9999, 12, 31))
                    .build(), CommonCodeResponse.builder()
                    .code("FJI")
                    .description("FIJI")
                    .validFrom(LocalDate.of(1900, 1, 1))
                    .validTo(LocalDate.of(9999, 12, 31))
                    .build());
        }

        @Test
        void getCountriesOutsideEEA() {
            List<CommonCodeResponse> res = webTestClient.get()
                    .uri("/codelist/countriesoutsideeea")
                    .exchange()
                    .expectStatus().isOk()
                    .expectBodyList(CommonCodeResponse.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(res).isNotNull();
            assertThat(res).containsExactly(CommonCodeResponse.builder()
                    .code("FJI")
                    .description("FIJI")
                    .validFrom(LocalDate.of(1900, 1, 1))
                    .validTo(LocalDate.of(9999, 12, 31))
                    .build());
        }
    }

    @Nested
    class Save {

        @Test
        void shouldSaveNewCodelists() {
            List<CodelistRequest> requests = List.of(createCodelistRequest("THIRD_PARTY", "SaveCode", "SaveShortName", "SaveDescription"));
            assertFalse(CodelistCache.contains(ListName.THIRD_PARTY, "SaveCode"));

            List<CodelistResponse> body = webTestClient.post()
                    .uri("/codelist")
                    .bodyValue(requests)
                    .exchange()
                    .expectStatus().isCreated()
                    .expectBodyList(CodelistResponse.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).isNotNull();
            CodelistResponse codelist = body.get(0);
            assertThat(codelist.getList()).isEqualTo(ListName.THIRD_PARTY);
            assertThat(codelist.getCode()).isEqualTo("SAVECODE");
            assertThat(codelist.getShortName()).isEqualTo("SaveShortName");
            assertThat(codelist.getDescription()).isEqualTo("SaveDescription");

            assertTrue(CodelistCache.contains(ListName.THIRD_PARTY, "SAVECODE"));
            Codelist savedCodelist = CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "SAVECODE");
            assertThat(savedCodelist.getCode()).isEqualTo("SAVECODE");
            assertThat(savedCodelist.getShortName()).isEqualTo("SaveShortName");
            assertThat(savedCodelist.getDescription()).isEqualTo("SaveDescription");
        }

        @Test
        void shouldNotSaveOrProcessAnEmptyRequest() {
            List<CodelistRequest> requests = Collections.emptyList();

            String body = webTestClient.post()
                    .uri("/codelist")
                    .bodyValue(requests)
                    .exchange()
                    .expectStatus().isCreated()
                    .expectBody(String.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).isEqualTo(Collections.EMPTY_LIST.toString());
        }

        @Test
        void shouldSave20Codelist() {
            service.refreshCache();
            List<CodelistRequest> requests = createNrOfCodelistRequests(20);

            webTestClient.post()
                    .uri("/codelist")
                    .bodyValue(requests)
                    .exchange()
                    .expectStatus().isCreated();

            assertThat(CodelistStaticService.getCodelist(ListName.THIRD_PARTY).size()).isEqualTo(20);
        }

        @Test
        void shouldInvalidateWrongListname() {
            List<CodelistRequest> requests = List.of(createCodelistRequest("PROVENAANCE"));

            String body = webTestClient.post()
                    .uri("/codelist")
                    .bodyValue(requests)
                    .exchange()
                    .expectStatus().isBadRequest()
                    .expectBody(String.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).contains("PROVENAANCE was invalid for type ListName");
        }


        @ParameterizedTest
        @ValueSource(strings = {"GDPR_ARTICLE", "SENSITIVITY"})
        void shouldInvalidateCreatingImmutableCodelist(String testValue) {
            List<CodelistRequest> requests = List.of(createCodelistRequest(testValue));

            String body = webTestClient.post()
                    .uri("/codelist")
                    .bodyValue(requests)
                    .exchange()
                    .expectStatus().isBadRequest()
                    .expectBody(String.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).contains(String.format(ERROR_IMMUTABLE_CODELIST, testValue));
        }
    }

    @Nested
    class Update {

        @Test
        void shouldUpdateOneCodelist() {
            saveCodelist(createCodelist(ListName.THIRD_PARTY, "CODE", "SavedShortName", "SavedDescription"));
            assertThat(CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "CODE").getShortName()).isEqualTo("SavedShortName");
            assertThat(CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "CODE").getDescription()).isEqualTo("SavedDescription");

            List<CodelistRequest> updatedCodelists = List.of(
                    createCodelistRequest("THIRD_PARTY", "CODE", "UpdatedShortName", "UpdatedDescription"));

            webTestClient.put()
                    .uri("/codelist")
                    .bodyValue(updatedCodelists)
                    .exchange()
                    .expectStatus().isOk();

            assertThat(CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "CODE").getShortName()).isEqualTo("UpdatedShortName");
            assertThat(CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "CODE").getDescription()).isEqualTo("UpdatedDescription");
        }

        @Test
        void shouldUpdate20Codelists() {
            service.refreshCache();
            List<CodelistRequest> requests = createNrOfCodelistRequests(20);
            webTestClient.post()
                    .uri("/codelist")
                    .bodyValue(requests)
                    .exchange()
                    .expectStatus().isCreated();

            requests.forEach(request -> {
                request.setShortName("UpdatedShortName");
                request.setDescription("UpdatedDescription");
            });

            webTestClient.put()
                    .uri("/codelist")
                    .bodyValue(requests)
                    .exchange()
                    .expectStatus().isOk();

            assertThat(CodelistStaticService.getCodelist(ListName.THIRD_PARTY).size()).isEqualTo(20);
            List<Codelist> list = CodelistStaticService.getCodelist(ListName.THIRD_PARTY);
            list.forEach(cod -> {
                assertThat(cod.getShortName()).isEqualTo("UpdatedShortName");
                assertThat(cod.getDescription()).isEqualTo("UpdatedDescription");
            });
        }
    }

    @Nested
    class Delete {

        @Test
        void shouldDeleteCodelist() {
            saveCodelist(createCodelist(ListName.THIRD_PARTY, "DELETE_CODE"));
            assertTrue(repository.findByListAndCode(ListName.THIRD_PARTY, "DELETE_CODE").isPresent());

            webTestClient.delete()
                    .uri("/codelist/THIRD_PARTY/DELETE_CODE")
                    .exchange()
                    .expectStatus().isOk();

            assertFalse(repository.findByListAndCode(ListName.THIRD_PARTY, "DELETE_CODE").isPresent());
        }

        @ParameterizedTest
        @ValueSource(strings = {"GDPR_ARTICLE", "SENSITIVITY"})
        void shouldInvalidateDeletingGDPR_ARTICLE(String input) {
            saveCodelist(createCodelist(ListName.valueOf(input), "DELETE"));
            String url = String.format("/codelist/%s/DELETE", input);

            String body = webTestClient.delete()
                    .uri(url)
                    .exchange()
                    .expectStatus().isNotFound()
                    .expectBody(String.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).contains(String.format(ERROR_IMMUTABLE_CODELIST, input));
        }

        @Test
        void shouldThrowCodelistNotErasableException_whenCodelistToBeDeletedIsStillInUse() {
            saveCodelist(createCodelist(ListName.THIRD_PARTY, "DELETE_CODE"));
            informationTypeRepository.save(createInformationType("infoType", "POL", "TPS", "PERSONALIA", "DELETE_CODE"));
            assertTrue(repository.findByListAndCode(ListName.THIRD_PARTY, "DELETE_CODE").isPresent());


            String body = webTestClient.delete()
                    .uri("/codelist/THIRD_PARTY/DELETE_CODE")
                    .exchange()
                    .expectStatus().isEqualTo(409)
                    .expectBody(String.class)
                    .returnResult()
                    .getResponseBody();

            assertThat(body).contains("The code DELETE_CODE in list THIRD_PARTY cannot be erased.");
            assertTrue(repository.findByListAndCode(ListName.THIRD_PARTY, "DELETE_CODE").isPresent());
        }

    }

    private void saveCodelist(Codelist codelist) {
        CodelistCache.set(codelist);
        repository.save(codelist);
    }


}
