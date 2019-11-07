package no.nav.data.polly.term.domain;

import no.nav.data.polly.term.dto.TermResponse;

import java.util.UUID;

public interface TermSlim {

    UUID getId();

    String getName();

    String getDescription();

    default TermResponse convertToResponse() {
        return new TermResponse(getId().toString(), getName(), getDescription(), null);
    }
}
