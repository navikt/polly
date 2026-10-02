package no.nav.data.common.validator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.StringUtils;

import java.util.UUID;

public interface RequestElement extends Validated {

    String getId();

    /**
     * Versjonen klienten sist leste (optimistisk låsing). Returnerer {@code null} for requests som
     * ikke støtter/sender versjon - da gjelder kun Hibernate sin versjonssjekk ved flush.
     * Implementasjoner deklarerer et {@code Integer version}-felt, og Lombok genererer getteren.
     */
    default Integer getVersion() {
        return null;
    }


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

    @Override
    default String getReference() {
        return "Request:" + getRequestIndex();
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
