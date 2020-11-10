package no.nav.data.common.storage.domain;

import java.util.UUID;

public interface LastModified {

    UUID getId();

    String getLastModifiedBy();
}
