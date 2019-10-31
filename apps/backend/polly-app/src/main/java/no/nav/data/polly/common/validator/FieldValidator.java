package no.nav.data.polly.common.validator;

import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import org.apache.commons.lang3.StringUtils;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

public class FieldValidator {

    private static final String ERROR_TYPE = "fieldIsNullOrMissing";
    private static final String ERROR_TYPE_ENUM = "fieldIsInvalidEnum";
    private static final String ERROR_TYPE_CODELIST = "fieldIsInvalidCodelist";
    private static final String ERROR_TYPE_DATE = "fieldIsInvalidDate";
    private static final String ERROR_MESSAGE = "%s was null or missing";
    private static final String ERROR_MESSAGE_ENUM = "%s: %s was invalid for type %s";
    private static final String ERROR_MESSAGE_CODELIST = "%s: %s code not found in codelist %s";
    private static final String ERROR_MESSAGE_DATE = "%s: %s date is not a valid format";
    private final List<ValidationError> validationErrors;
    private final String reference;


    public FieldValidator(String reference) {
        this.validationErrors = new ArrayList<>();
        this.reference = reference;
    }

    public boolean checkBlank(String fieldName, String fieldValue) {
        if (StringUtils.isBlank(fieldValue)) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE, String.format(ERROR_MESSAGE, fieldName)));
            return true;
        }
        return false;
    }

    public <T extends Enum<T>> void checkEnum(String fieldName, String fieldValue, Class<T> type) {
        if (checkBlank(fieldName, fieldValue)) {
            return;
        }
        try {
            Enum.valueOf(type, fieldValue);
        } catch (IllegalArgumentException e) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_ENUM, String.format(ERROR_MESSAGE_ENUM, fieldName, fieldValue, type.getSimpleName())));
        }
    }

    public void checkRequiredCodelist(String fieldName, String fieldValue, ListName listName) {
        if (checkBlank(fieldName, fieldValue)) {
            return;
        }
        checkCode(fieldName, fieldValue, listName);
    }

    public void checkCodelist(String fieldName, String fieldValue, ListName listName) {
        if (StringUtils.isBlank(fieldValue)) {
            return;
        }
        checkCode(fieldName, fieldValue, listName);
    }

    private void checkCode(String fieldName, String fieldValue, ListName listName) {
        if (CodelistService.getCodeResponseForCodelistItem(listName, fieldValue) == null) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_CODELIST, String.format(ERROR_MESSAGE_CODELIST, fieldName, fieldValue, listName)));
        }
    }

    public void checkCodelists(String fieldName, Collection<String> values, ListName listName) {
        safeStream(values).forEach(value -> checkRequiredCodelist(fieldName, value, listName));
    }

    public void checkDate(String fieldName, String fieldValue) {
        if (StringUtils.isBlank(fieldValue)) {
            return;
        }
        try {
            LocalDate.parse(fieldValue);
        } catch (DateTimeParseException e) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_DATE, String.format(ERROR_MESSAGE_DATE, fieldName, fieldValue)));
        }
    }

    public void validateType(String fieldName, Collection<? extends Validated> fieldValues) {
        AtomicInteger i = new AtomicInteger(0);
        safeStream(fieldValues).forEach(fieldValue -> {
            FieldValidator fieldValidator = new FieldValidator(String.format("%s.%s[%d]", reference, fieldName, i.getAndIncrement()));
            fieldValue.validate(fieldValidator);
            validationErrors.addAll(fieldValidator.getErrors());
        });
    }

    List<ValidationError> getErrors() {
        return validationErrors;
    }
}