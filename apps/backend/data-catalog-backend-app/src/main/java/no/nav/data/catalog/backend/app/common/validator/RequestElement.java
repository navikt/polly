package no.nav.data.catalog.backend.app.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;

public interface RequestElement {
    @JsonIgnore
    String getIdentifyingFields();

    @JsonIgnore
    String getRequestType();
}
