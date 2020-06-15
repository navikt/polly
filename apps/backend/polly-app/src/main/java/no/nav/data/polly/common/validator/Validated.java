package no.nav.data.polly.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

public interface Validated {

    default void format() {
    }

    void validate(FieldValidator validator);

    @JsonIgnore
    default String getReference() {
        return "";
    }

    @JsonIgnore
    default List<ValidationError> validateFields() {
        format();
        FieldValidator validator = new FieldValidator(getReference());
        validate(validator);
        return validator.getErrors();
    }
}
