package no.nav.data.polly.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.StringUtils;

public interface RequestElement {

    @JsonIgnore
    String getIdentifyingFields();

    @JsonIgnore
    default String getRequestType() {
        return StringUtils.substringBefore(getClass().getSimpleName(), "Request");
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
