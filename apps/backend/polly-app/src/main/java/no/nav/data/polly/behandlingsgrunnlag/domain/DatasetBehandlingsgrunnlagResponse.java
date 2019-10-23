package no.nav.data.polly.behandlingsgrunnlag.domain;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Value;

import java.util.UUID;

@Value
@JsonPropertyOrder({"id", "name", "legalBasisDescription"})
public class DatasetBehandlingsgrunnlagResponse {

    private UUID id;
    private String name;
    private String legalBasisDescription;
}
