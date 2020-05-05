package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.process.dto.ProcessResponse;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "processId", "process", "purposeCode", "subjectCategories", "legalBasesInherited",
        "informationTypeId", "informationType", "legalBases", "documentIds"})
public class PolicyResponse {

    private UUID id;
    private UUID processId;
    private ProcessResponse process;
    private CodelistResponse purposeCode;
    @Singular
    private List<CodelistResponse> subjectCategories;
    private boolean legalBasesInherited;
    private UUID informationTypeId;
    private InformationTypeShortResponse informationType;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;
    private List<UUID> documentIds;

}
