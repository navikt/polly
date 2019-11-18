package no.nav.data.polly.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.UUID;

public interface RequestElement extends Validated {

    String getId();

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
        format();
        FieldValidator validator = new FieldValidator(getReference());
        validate(validator);
        return validator.getErrors();
    }

    @JsonIgnore
    default UUID getIdAsUUID() {
        try {
            return getId() == null ? null : UUID.fromString(getId());
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

}
