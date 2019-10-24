package no.nav.data.polly.policy.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodeResponse;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"policyId", "legalBasisDescription", "start", "end", "active", "purpose", "informationType"})
public class PolicyResponse {

    private UUID policyId;
    private String legalBasisDescription;
    private LocalDate start;
    private LocalDate end;
    private boolean active;
    private CodeResponse purpose;
    private InformationTypeNameResponse informationType;

}
