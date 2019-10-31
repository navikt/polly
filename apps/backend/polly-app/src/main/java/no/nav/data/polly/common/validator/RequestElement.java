package no.nav.data.polly.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

public interface RequestElement extends Validated {

    @JsonIgnore
    String getIdentifyingFields();

    @JsonIgnore
    default String getRequestType() {
        return StringUtils.substringBeforeLast(getClass().getSimpleName(), "Request");
    }

    @JsonIgnore
    boolean isUpdate();

    @JsonIgnore
    void setUpdate(boolean update);

    @JsonIgnore
    int getRequestIndex();

    @JsonIgnore
    void setRequestIndex(int index);

    @JsonIgnore
    default String getReference() {
        return "Request:" + getRequestIndex();
    }

    @JsonIgnore
    default List<ValidationError> validateFields() {
        FieldValidator validator = new FieldValidator(getReference());
        validate(validator);
        return validator.getErrors();
    }

}
