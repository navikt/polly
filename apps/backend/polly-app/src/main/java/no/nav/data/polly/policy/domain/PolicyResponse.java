package no.nav.data.polly.policy.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodeResponse;
import no.nav.data.polly.legalbasis.LegalBasisResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"policyId", "start", "end", "active", "purposeCode", "legalBases", "informationType"})
public class PolicyResponse {

    private UUID id;
    private String subjectCategories;
    private String process;
    private LocalDate start;
    private LocalDate end;
    private boolean active;
    private CodeResponse purposeCode;
    private List<LegalBasisResponse> legalBases;
    private InformationTypeNameResponse informationType;

}
