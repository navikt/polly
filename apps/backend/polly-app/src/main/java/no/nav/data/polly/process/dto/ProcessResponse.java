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
@JsonPropertyOrder({"id", "name", "description", "purposeCode", "department", "subDepartment", "productTeam", "start", "end", "active",
        "automaticProcessing", "profiling", "dataProcessor", "dataProcessorAgreement", "dataProcessorOutsideEU",
        "legalBases", "policies"})
public class ProcessResponse {

    private UUID id;
    private String name;
    private String description;
    private String purposeCode;
    private CodelistResponse department;
    private CodelistResponse subDepartment;
    private String productTeam;
    private LocalDate start;
    private LocalDate end;

    private Boolean automaticProcessing;
    private Boolean profiling;
    private Boolean dataProcessor;
    private String dataProcessorAgreement;
    private Boolean dataProcessorOutsideEU;

    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;
    @ApiModelProperty("Only set when get/create/update one process")
    @Singular
    private List<PolicyResponse> policies;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

}
