package no.nav.data.polly.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;

public interface RequestElement {

    @JsonIgnore
    String getIdentifyingFields();

    @JsonIgnore
    default String getRequestType() {
        return getClass().getSimpleName();
    }

    @JsonIgnore
    boolean isUpdate();

    @JsonIgnore
    int getRequestIndex();

    @JsonIgnore
    default String getReference() {
        return "Request:" + getRequestIndex();
    }

    @JsonIgnore
    FieldValidator validateFields();
}
