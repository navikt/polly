package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.rest.ChangeStampResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.domain.ProcessStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "purpose", "purposeCode", "department", "subDepartments", "commonExternalProcessResponsible",
        "productTeams", "products", "start", "end", "active",
        "usesAllInformationTypes", "automaticProcessing", "profiling", "dataProcessing", "retention", "dpia", "status", "changeStamp",
        "legalBases", "policies"})
public class ProcessResponse {

    private UUID id;
    private String name;
    private String description;
    private CodelistResponse purpose;
    private String purposeCode;
    private CodelistResponse department;
    @Singular
    private List<CodelistResponse> subDepartments;
    private CodelistResponse commonExternalProcessResponsible;
    @Singular
    private List<String> productTeams;
    @Singular
    private List<CodelistResponse> products;
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

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonPropertyOrder({"dataProcessor", "dataProcessorAgreements", "dataProcessorOutsideEU"})
    public static class DataProcessingResponse {

        private Boolean dataProcessor;
        @Singular
        private List<String> dataProcessorAgreements;
        private Boolean dataProcessorOutsideEU;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonPropertyOrder({"retentionPlan", "retentionMonths", "retentionStart", "retentionDescription"})
    public static class RetentionResponse {

        private Boolean retentionPlan;
        private Integer retentionMonths;
        private String retentionStart;
        private String retentionDescription;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonPropertyOrder({"needForDpia", "refToDpia", "grounds", "processImplemented", "riskOwner", "riskOwnerFunction"})
    public static class DpiaResponse {

        private Boolean needForDpia;
        private String refToDpia;
        private String grounds;
        private boolean processImplemented;
        private String riskOwner;
        private String riskOwnerFunction;
    }

}
