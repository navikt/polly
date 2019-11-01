package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "purposeCode", "legalBases", "informationTypes"})
public class ProcessPolicyResponse {

    private String id;
    private String name;
    private String purposeCode;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;
    @Singular
    private List<PolicyResponse> policies;

}
