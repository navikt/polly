package no.nav.data.polly.behandlingsgrunnlag.domain;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Value;
import no.nav.data.polly.legalbasis.LegalBasisResponse;

import java.util.List;
import java.util.UUID;

@Value
@JsonPropertyOrder({"id", "name", "legalBases"})
public class InformationTypeBehandlingsgrunnlagResponse {

    private UUID id;
    private String name;
    private List<LegalBasisResponse> legalBases;
}
