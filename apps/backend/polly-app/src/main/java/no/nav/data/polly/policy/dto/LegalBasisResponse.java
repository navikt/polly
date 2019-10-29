package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"gdpr", "nationalLaw", "description"})
public class LegalBasisResponse {

    @NotNull
    private String gdpr;
    private String nationalLaw;
    @NotNull
    private String description;

}
