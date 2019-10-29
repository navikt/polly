package no.nav.data.polly.purpose.domain;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Value;

import java.util.List;

@Value
@JsonPropertyOrder({"purpose", "informationTypes"})
public class PurposeResponse {

    private String purpose;
    private List<InformationTypePurposeResponse> informationTypes;
}
