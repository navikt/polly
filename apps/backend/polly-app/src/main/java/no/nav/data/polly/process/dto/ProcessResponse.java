package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
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
import no.nav.data.polly.process.dto.sub.AffiliationResponse;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;
import no.nav.data.polly.process.dto.sub.DpiaResponse;
import no.nav.data.polly.process.dto.sub.RetentionResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "purpose", "purposeCode", "affiliation",
        "commonExternalProcessResponsible", "start", "end", "active",
        "usesAllInformationTypes", "automaticProcessing", "profiling", "dataProcessing", "retention", "dpia", "status", "changeStamp",
        "legalBases", "policies"})
public class ProcessResponse {

    private UUID id;
    private String name;
    private String description;
    private CodelistResponse purpose;
    private String purposeCode;
    private AffiliationResponse affiliation;

    private CodelistResponse commonExternalProcessResponsible;
    private LocalDate start;
    private LocalDate end;

    private boolean usesAllInformationTypes;
    private Boolean automaticProcessing;
    private Boolean profiling;
    private DataProcessingResponse dataProcessing;
    private RetentionResponse retention;
    private DpiaResponse dpia;
    private ProcessStatus status;
    private ChangeStampResponse changeStamp;

    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;
    @ApiModelProperty("Only set when get/create/update one process")
    @Singular
    private List<PolicyResponse> policies;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

}
