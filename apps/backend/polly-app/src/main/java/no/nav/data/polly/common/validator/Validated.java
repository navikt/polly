package no.nav.data.polly.common.validator;

public interface Validated {

    default void format() {
    }

    void validate(FieldValidator validator);

}
