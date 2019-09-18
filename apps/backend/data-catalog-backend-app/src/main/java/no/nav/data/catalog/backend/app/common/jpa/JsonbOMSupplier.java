package no.nav.data.catalog.backend.app.common.jpa;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladmihalcea.hibernate.type.util.ObjectMapperSupplier;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;

public class JsonbOMSupplier implements ObjectMapperSupplier {

    @Override
    public ObjectMapper get() {
        return JsonUtils.getObjectMapper();
    }
}
