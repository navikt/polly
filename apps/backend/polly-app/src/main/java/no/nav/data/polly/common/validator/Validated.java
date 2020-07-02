package no.nav.data.polly.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public interface Validated {

    default void format() {
    }

    void validate(FieldValidator validator);

    @JsonIgnore
    default String getReference() {
        return "Request";
    }

    default List<ValidationError> validateFields() {
        format();
        FieldValidator validator = new FieldValidator(getReference());
        validate(validator);
        return validator.getErrors();
    }

    default void validateFieldsAndThrow() {
        RequestValidator.ifErrorsThrowValidationException(validateFields());
    }
}
