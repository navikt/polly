package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.purpose.dto.InformationTypePurposeResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id,", "name", "purposeCode", "informationTypes"})
public class ProcessPolicyResponse {

    private String id;
    private String name;
    private String purposeCode;
    @Singular
    private List<InformationTypePurposeResponse> informationTypes;

}
