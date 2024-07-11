package no.nav.data.polly.codelist;

import no.nav.data.common.exceptions.CodelistNotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.polly.codelist.codeusage.CodeUsageService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistRequestValidator;
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

import static no.nav.data.polly.codelist.CodelistUtils.createCodelist;
import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("static-access") // TODO: Fjern når dette ikke trengs
class CodelistRequestValidatorTest {

    private static final String VALIDATION_EXCEPTION_ERROR_MESSAGE = "The request was not accepted. The following errors occurred during validation: [%s]";
    @Mock
    private CodelistRepository repository;
    @Mock
    private CodeUsageService codeUsageService;

    @InjectMocks
    private CodelistService service;

    @InjectMocks
    CodelistRequestValidator requestValidator;

    @Nested
    class validateListName {

        @Test
        void shouldValidate_whenListNameExist() {
            saveCodelist(createCodelist(ListName.PURPOSE, "VALID_CODE"));
            requestValidator.validateListName("PURPOSE");
        }

        @ParameterizedTest
        @NullAndEmptySource
        void shouldThrowCodelistNotFoundException_whenInputIsNullOrMissing(String input) {
            try {
                requestValidator.validateListName(input);
                fail();
            } catch (CodelistNotFoundException e) {
                assertThat(e.getLocalizedMessage()).isEqualTo("Validate Codelist -- fieldIsNullOrMissing -- list was null or missing");
            }
        }

        @Test
        void shouldThrowCodelistNotFoundException_withInvalidListName() {
            try {
                requestValidator.validateListName("INVALID_LISTNAME");
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
            requestValidator.validateListNameAndCode("PURPOSE", "VALID_CODE");
        }

        @ParameterizedTest
        @NullAndEmptySource
        void shouldThrowCodelistNotFoundException_whenInputForCodeIsNullOrMissing(String input) {
            try {
                requestValidator.validateListNameAndCode("PURPOSE", input);
                fail();
            } catch (CodelistNotFoundException e) {
                assertThat(e.getLocalizedMessage()).isEqualTo("Validate Codelist -- fieldIsNullOrMissing -- code was null or missing");
            }
        }

        @Test
        void shouldThrowCodelistNotFoundException_whenCodeNotValidForListName() {
            try {
                requestValidator.validateListNameAndCode("THIRD_PARTY", "UNKNOWN_CODE");
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
            requestValidator.validateNonImmutableTypeOfCodelist(ListName.PURPOSE);
        }

        @ParameterizedTest
        @ValueSource(strings = {"GDPR_ARTICLE", "SENSITIVITY"})
        void shouldThrowCodelistNotFoundException_whenCodelistIsOfImmutableType(String input) {
            try {
                requestValidator.validateNonImmutableTypeOfCodelist(ListName.valueOf(input));
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
            requestValidator.validateRequest(Collections.emptyList(), false);
        }

        @Test
        void shouldValidate_whenCreatingNonExistingItem() {
            List<CodelistRequest> requests = List.of(
                    createCodelistRequest("THIRD_PARTY"),
                    createCodelistRequest("CATEGORY"));

            when(repository.findByListAndCode(any(ListName.class), anyString())).thenReturn(Optional.empty());

            requestValidator.validateRequest(requests, false); //false => create new codelist
        }

        @Test
        void shouldThrowValidationException_whenCreatingExistingItem() {
            List<CodelistRequest> requests = List.of(createCodelistRequest("THIRD_PARTY", "BRUKER"));
            Codelist expectedCodelist = createCodelist(ListName.THIRD_PARTY, "BRUKER");

            when(repository.findByListAndCode(ListName.THIRD_PARTY, "BRUKER")).thenReturn(Optional.of(expectedCodelist));

            try {
                requestValidator.validateRequest(requests, false);
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

            requestValidator.validateRequest(requests, true);
        }

        @Test
        void shouldThrowValidationException_whenUpdatingNonExistingItem() {
            List<CodelistRequest> requests = List.of(createCodelistRequest("THIRD_PARTY", "unknownCode"));

            try {
                requestValidator.validateRequest(requests, true);
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
            requestValidator.validateRequest(requests, false);
            service.save(CodelistRequest.convertToCodelists(requests));
            assertTrue(CodelistCache.contains(ListName.CATEGORY, "CORRECTFORMAT"));
            assertThat(CodelistStaticService.getCodelist(ListName.CATEGORY, "CORRECTFORMAT").getDescription()).isEqualTo("Trim av description");
        }

    }

    private void saveCodelist(Codelist codelist) {
        CodelistCache.set(codelist);
    }
}
