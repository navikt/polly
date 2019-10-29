package no.nav.data.polly.purpose.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Value;
import no.nav.data.polly.process.dto.ProcessResponse;

import java.util.List;

@Value
@JsonPropertyOrder({"purpose", "processes"})
public class PurposeResponse {

    private String purpose;
    private List<ProcessResponse> processes;
}
