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

    void setUpdate(boolean update);

    @JsonIgnore
    int getRequestIndex();

    void setRequestIndex(int index);

    @JsonIgnore
    default String getReference() {
        return "Request:" + getRequestIndex();
    }

    @JsonIgnore
    default FieldValidator validateFields() {
        FieldValidator validator = new FieldValidator(getReference());
        validate(validator);
        return validator;
    }

    void validate(FieldValidator validator);

}
