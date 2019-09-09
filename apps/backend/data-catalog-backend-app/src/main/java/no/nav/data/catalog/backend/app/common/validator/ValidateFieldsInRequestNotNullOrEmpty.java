package no.nav.data.catalog.backend.app.common.validator;

import no.nav.data.catalog.backend.app.common.utils.StreamUtils;

import java.util.ArrayList;
import java.util.List;

public class ValidateFieldsInRequestNotNullOrEmpty {

    private static final String ERROR_TYPE = "fieldIsNullOrMissing";
    private static final String ERROR_MESSAGE = "%s was null or missing";
    private static final String ERROR_MESSAGE_ENUM = "%s was invalid for type %s";
    private final List<ValidationError> validationErrors;
    private final String reference;


    public ValidateFieldsInRequestNotNullOrEmpty(String reference) {
        this.validationErrors = new ArrayList<>();
        this.reference = reference;
    }

    public void checkField(String fieldName, String fieldValue) {
        if (fieldValue == null || fieldValue.isEmpty()) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE, String.format(ERROR_MESSAGE, fieldName)));
        }
    }

    public <T extends Enum<T>> void checkEnum(String fieldName, String fieldValue, Class<T> type) {
        if (fieldValue == null || fieldValue.isEmpty()) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE, String.format(ERROR_MESSAGE, fieldName)));
            return;
        }
        try {
            Enum.valueOf(type, fieldValue);
        } catch (IllegalArgumentException e) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE, String.format(ERROR_MESSAGE_ENUM, fieldName, type.getSimpleName())));
        }
    }

    public void checkListOfFields(String listName, List<String> fields) {
        fields = StreamUtils.nullToEmptyList(fields);
        //TODO: Find out if empty list should throw validationError or allowed not processed
        if (fields.isEmpty()) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE, String.format(ERROR_MESSAGE, listName)));
        } else {
            fields.forEach(f -> checkField(listName, f));
        }
    }

    public List<ValidationError> getErrors() {
        return validationErrors;
    }
}