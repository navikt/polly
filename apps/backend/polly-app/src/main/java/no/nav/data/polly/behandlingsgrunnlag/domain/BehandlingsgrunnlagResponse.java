package no.nav.data.polly.behandlingsgrunnlag.domain;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Value;

import java.util.List;

@Value
@JsonPropertyOrder({"purpose", "informationTypes"})
public class BehandlingsgrunnlagResponse {

    private String purpose;
    private List<InformationTypeBehandlingsgrunnlagResponse> informationTypes;
}
