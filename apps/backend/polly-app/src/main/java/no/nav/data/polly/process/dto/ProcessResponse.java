package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.sub.AiUsageDescription;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;
import no.nav.data.polly.process.dto.sub.DpiaResponse;
import no.nav.data.polly.process.dto.sub.RetentionResponse;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "number", "name", "description", "additionalDescription", "purpose", "purposes", "affiliation",
        "commonExternalProcessResponsible", "start", "end", "active",
        "usesAllInformationTypes", "automaticProcessing", "profiling", "dataProcessing", "retention", "dpia", "status", "revisionText", "changeStamp",
        "legalBases", "policies"})
public class ProcessResponse {

    private UUID id;
    private int number;
    private String name;
    private String description;
    private String additionalDescription;
    private List<CodelistResponse> purposes;
    @Schema(deprecated = true, description = "Deprecated, returns first purpose, use 'purposes' instead")
    private CodelistResponse purpose;
    private AffiliationResponse affiliation;

    private CodelistResponse commonExternalProcessResponsible;
    private LocalDate start;
    private LocalDate end;

    private boolean usesAllInformationTypes;
    private Boolean automaticProcessing;
    private Boolean profiling;
    private AiUsageDescription aiUsageDescription;
    private DataProcessingResponse dataProcessing;
    private RetentionResponse retention;
    private DpiaResponse dpia;
    private ProcessStatus status;
    private String revisionText;
    private ChangeStampResponse changeStamp;

    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;
    @Schema(description = "Only set when get/create/update one process")
    @Singular
    private List<PolicyResponse> policies;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

    public static class ProcessResponseBuilder {

        private List<CodelistResponse> purposes = new ArrayList<>();

        public ProcessResponseBuilder purposes(List<CodelistResponse> purposes) {
            this.purposes = new ArrayList<>(purposes);
            purpose = purposes.isEmpty() ? null : purposes.get(0);
            return this;
        }
    }
}
