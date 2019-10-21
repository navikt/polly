package no.nav.data.polly.behandlingsgrunnlag.domain;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Value;

@Value
@JsonPropertyOrder({"id", "title", "legalBasisDescription"})
public class DatasetBehandlingsgrunnlagResponse {

    private String id;
    private String title;
    private String legalBasisDescription;
}
