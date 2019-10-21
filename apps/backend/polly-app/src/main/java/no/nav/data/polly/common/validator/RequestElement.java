package no.nav.data.polly.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;

public interface RequestElement {
    @JsonIgnore
    String getIdentifyingFields();

    @JsonIgnore
    String getRequestType();

    @JsonIgnore
    boolean isUpdate();

    @JsonIgnore
    int getRequestIndex();

    @JsonIgnore
    String getReference();

    @JsonIgnore
    FieldValidator validateFields();
}
