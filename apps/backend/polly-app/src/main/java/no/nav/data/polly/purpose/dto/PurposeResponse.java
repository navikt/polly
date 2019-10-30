package no.nav.data.polly.purpose.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.process.dto.ProcessPolicyResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"purpose", "processes"})
public class PurposeResponse {

    private String purpose;
    @Singular
    private List<ProcessPolicyResponse> processes;
}
