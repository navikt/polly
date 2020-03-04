package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "purposeCode", "department", "subDepartment", "productTeams", "products", "start", "end", "active",
        "usesAllInformationTypes", "automaticProcessing", "profiling", "dataProcessing", "retention",
        "legalBases", "policies"})
public class ProcessResponse {

    private UUID id;
    private String name;
    private String description;
    private String purposeCode;
    private CodelistResponse department;
    private CodelistResponse subDepartment;
    private String productTeam;
    @Singular
    private List<CodelistResponse> products;
    private LocalDate start;
    private LocalDate end;

    private Boolean usesAllInformationTypes;
    private Boolean automaticProcessing;
    private Boolean profiling;
    private DataProcessingResponse dataProcessing;
    private RetentionResponse retention;

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

}
