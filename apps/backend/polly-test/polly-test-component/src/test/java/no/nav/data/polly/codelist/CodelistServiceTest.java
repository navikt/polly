package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.codeusage.CodeUsageService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.common.exceptions.CodelistNotErasableException;
import no.nav.data.polly.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.AdditionalAnswers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelist;
import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CodelistServiceTest {

    private static final String VALIDATION_EXCEPTION_ERROR_MESSAGE = "The request was not accepted. The following errors occurred during validation: [%s]";
    @Mock
    private CodelistRepository repository;
    @Mock
    private CodeUsageService codeUsageService;

    @InjectMocks
    private CodelistService service;

    @Nested
    class CrudMethods {

        @Test
        void save_shouldSaveCodelist_whenRequestIsValid() {
            when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
            service.save(List.of(createCodelistRequest("THIRD_PARTY", "TEST_CODE", "Test shortName", "Test description")));
            verify(repository, times(1)).saveAll(anyList());
            assertThat(CodelistService.getCodelist(ListName.THIRD_PARTY, "TEST_CODE").getShortName()).isEqualTo("Test shortName");
            assertThat(CodelistService.getCodelist(ListName.THIRD_PARTY, "TEST_CODE").getDescription()).isEqualTo("Test description");
        }

        @Test
        void update_shouldUpdateCodelist_whenRequestIsValid() {
            saveCodelist(createCodelist(ListName.THIRD_PARTY, "CODE", "name1", "desc1"));

            CodelistRequest request = createCodelistRequest();
            request.setShortName("name2");
            request.setDescription("desc2");

            when(repository.findByListAndCode(ListName.THIRD_PARTY, "CODE")).thenReturn(Optional.of(request.convert()));
            when(repository.saveAll(List.of(request.convert()))).thenReturn(List.of(request.convert()));

            service.update(List.of(request));

            verify(repository, times(1)).saveAll(anyList());
            Codelist codelist = CodelistService.getCodelist(ListName.THIRD_PARTY, request.getCode());
            assertThat(codelist.getShortName()).isEqualTo("name2");
            assertThat(codelist.getDescription()).isEqualTo("desc2");
        }

        @Test
        void delete_shouldDelete_whenListAndCodeExists() {
            when(repository.findByListAndCode(ListName.THIRD_PARTY, "DELETE_CODE")).thenReturn(Optional.of(createCodelist(ListName.THIRD_PARTY, "DELETE_CODE")));
            when(codeUsageService.findCodeUsage(ListName.THIRD_PARTY, "DELETE_CODE")).thenReturn(new CodeUsageResponse(ListName.THIRD_PARTY, "DELETE_CODE"));

            service.delete(ListName.THIRD_PARTY, "DELETE_CODE");

            verify(repository, times(1)).delete(any(Codelist.class));
            assertNull(CodelistService.getCodelist(ListName.THIRD_PARTY, "DELETE_CODE"));
        }

        @Test
        void delete_shouldThrowCodelistNotFoundException_whenCodeDoesNotExist() {
            when(repository.findByListAndCode(ListName.THIRD_PARTY, "UNKNOWN_CODE")).thenReturn(Optional.empty());

            try {
                service.delete(ListName.THIRD_PARTY, "UNKNOWN_CODE");
                fail();
            } catch (CodelistNotFoundException e) {
                assertThat(e.getLocalizedMessage()).isEqualTo("Cannot find a codelist to delete with code=UNKNOWN_CODE and listName=THIRD_PARTY");
            }
        }

        @Test
        void delete_shouldThrowCodelistNotErasableException_whenCodelistIsInUse() {
            CodeUsageResponse codeUsage = new CodeUsageResponse(ListName.THIRD_PARTY, "DELETE_CODE");
            codeUsage.setProcesses(List.of(ProcessShortResponse.builder().id(UUID.randomUUID()).name("name").build()));
            when(repository.findByListAndCode(ListName.PURPOSE, "DELETE_CODE")).thenReturn(Optional.of(createCodelist(ListName.THIRD_PARTY, "DELETE_CODE")));
            when(codeUsageService.findCodeUsage(ListName.PURPOSE, "DELETE_CODE")).thenReturn(codeUsage);

            try {
                service.delete(ListName.PURPOSE, "DELETE_CODE");
                fail();
            } catch (CodelistNotErasableException e) {
                assertThat(e.getLocalizedMessage()).contains("The code DELETE_CODE in list PURPOSE cannot be erased");
            }
        }
    }

    @Nested
    class validationMethods {

        @Nested
        class validateListName {

            @Test
            void shouldValidate_whenListNameExist() {
                saveCodelist(createCodelist(ListName.PURPOSE, "VALID_CODE"));
                service.validateListName("PURPOSE");
            }

            @ParameterizedTest
            @NullAndEmptySource
            void shouldThrowCodelistNotFoundException_whenInputIsNullOrMissing(String input) {
                try {
                    service.validateListName(input);
                    fail();
                } catch (CodelistNotFoundException e) {
                    assertThat(e.getLocalizedMessage()).isEqualTo("Validate Codelist -- fieldIsNullOrMissing -- list was null or missing");
                }
            }

            @Test
            void shouldThrowCodelistNotFoundException_withInvalidListName() {
                try {
                    service.validateListName("INVALID_LISTNAME");
                    fail();
                } catch (CodelistNotFoundException e) {
                    assertThat(e.getLocalizedMessage()).isEqualTo("Validate Codelist -- fieldIsInvalidEnum -- list: INVALID_LISTNAME was invalid for type ListName");
                }
            }
        }

        @Nested
        class validateListNameAndCode {

            @Test
            void shouldValidateWhenListNameAndCodeExist() {
                saveCodelist(createCodelist(ListName.PURPOSE, "VALID_CODE"));
                service.validateListNameAndCode("PURPOSE", "VALID_CODE");
            }

            @ParameterizedTest
            @NullAndEmptySource
            void shouldThrowCodelistNotFoundException_whenInputForCodeIsNullOrMissing(String input) {
                try {
                    service.validateListNameAndCode("PURPOSE", input);
                    fail();
                } catch (CodelistNotFoundException e) {
                    assertThat(e.getLocalizedMessage()).isEqualTo("Validate Codelist -- fieldIsNullOrMissing -- code was null or missing");
                }
            }

            @Test
            void shouldThrowCodelistNotFoundException_whenCodeNotValidForListName() {
                try {
                    service.validateListNameAndCode("THIRD_PARTY", "UNKNOWN_CODE");
                    fail();
                } catch (CodelistNotFoundException e) {
                    assertThat(e.getLocalizedMessage()).isEqualTo("Validate Codelist -- fieldIsInvalidCodelist -- code: UNKNOWN_CODE code not found in codelist THIRD_PARTY");
                }
            }
        }

        @Nested
        class validateListNameNotImmutable {

            @Test
            void shouldValidate_whenCodelistIsNotOfImmutableType() {
                service.validateNonImmutableTypeOfCodelist(ListName.PURPOSE);
            }

            @ParameterizedTest
            @ValueSource(strings = {"GDPR_ARTICLE", "SENSITIVITY"})
            void shouldThrowCodelistNotFoundException_whenCodelistIsOfImmutableType(String input) {
                try {
                    service.validateNonImmutableTypeOfCodelist(ListName.valueOf(input));
                    fail();
                } catch (CodelistNotFoundException e) {
                    assertThat(e.getLocalizedMessage()).isEqualTo(
                            String.format("Validate Codelist -- codelistIsOfImmutableType -- %s is an immutable type of codelist. For amendments, please contact team #dataplatform", input));
                }
            }
        }

        @Nested
        class validateRequest {

            @Test
            void shouldValidateWithoutAnyProcessing_whenRequestIsEmpty() {
                service.validateRequest(Collections.emptyList(), false);
            }

            @Test
            void shouldValidate_whenCreatingNonExistingItem() {
                List<CodelistRequest> requests = List.of(
                        createCodelistRequest("THIRD_PARTY"),
                        createCodelistRequest("CATEGORY"));

                when(repository.findByListAndCode(any(ListName.class), anyString())).thenReturn(Optional.empty());

                service.validateRequest(requests, false); //false => create new codelist
            }

            @Test
            void shouldThrowValidationException_whenCreatingExistingItem() {
                List<CodelistRequest> requests = List.of(createCodelistRequest("THIRD_PARTY", "BRUKER"));
                Codelist expectedCodelist = createCodelist(ListName.THIRD_PARTY, "BRUKER");

                when(repository.findByListAndCode(ListName.THIRD_PARTY, "BRUKER")).thenReturn(Optional.of(expectedCodelist));

                try {
                    service.validateRequest(requests, false);
                    fail();
                } catch (ValidationException e) {
                    assertThat(e.get().size()).isEqualTo(1);
                    assertThat(e.getLocalizedMessage()).isEqualTo(String.format(VALIDATION_EXCEPTION_ERROR_MESSAGE,
                            "Request:1 -- creatingExistingCodelist -- The Codelist THIRD_PARTY-BRUKER already exists and therefore cannot be created"));
                }
            }

            @Test
            void shouldValidate_whenUpdatingExistingItem() {
                saveCodelist(createCodelist(ListName.THIRD_PARTY, "TEST", "name", "description"));
                when(repository.findByListAndCode(ListName.THIRD_PARTY, "TEST")).thenReturn(Optional.of(CodelistCache.getCodelist(ListName.THIRD_PARTY, "TEST")));

                List<CodelistRequest> requests = List.of(createCodelistRequest("THIRD_PARTY", "TEST", "name", "Informasjon oppgitt av tester"));

                service.validateRequest(requests, true);
            }

            @Test
            void shouldThrowValidationException_whenUpdatingNonExistingItem() {
                List<CodelistRequest> requests = List.of(createCodelistRequest("THIRD_PARTY", "unknownCode"));

                try {
                    service.validateRequest(requests, true);
                    fail();
                } catch (ValidationException e) {
                    assertThat(e.get().size()).isEqualTo(1);
                    assertThat(e.getLocalizedMessage())
                            .isEqualTo(String.format(VALIDATION_EXCEPTION_ERROR_MESSAGE,
                                    "Request:1 -- updatingNonExistingCodelist -- The Codelist THIRD_PARTY-UNKNOWNCODE does not exist and therefore cannot be updated"));
                }
            }

            @Test
            void validateThatAllFieldsHaveValidValues_shouldChangeInputInRequestToCorrectFormat() {
                List<CodelistRequest> requests = List.of(
                        createCodelistRequest("     category      ", "    cOrRecTFormAT  ", "  name ", "   Trim av description             "));
                when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
                service.validateRequest(requests, false);
                service.save(requests);
                assertTrue(CodelistCache.contains(ListName.CATEGORY, "CORRECTFORMAT"));
                assertThat(CodelistService.getCodelist(ListName.CATEGORY, "CORRECTFORMAT").getDescription()).isEqualTo("Trim av description");
            }
        }

    }

    private void saveCodelist(Codelist codelist) {
        CodelistCache.set(codelist);
    }
}
