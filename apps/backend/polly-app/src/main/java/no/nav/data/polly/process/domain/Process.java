package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.codelist.dto.UsedInInstancePurpose;
import no.nav.data.polly.common.auditing.domain.Auditable;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.ProcessData.DataProcessing;
import no.nav.data.polly.process.domain.ProcessData.Retention;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessRequest.DataProcessingRequest;
import no.nav.data.polly.process.dto.ProcessRequest.RetentionRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessResponse.DataProcessingResponse;
import no.nav.data.polly.process.dto.ProcessResponse.RetentionResponse;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;

@Data
@Builder
@ToString(exclude = {"policies"})
@EqualsAndHashCode(callSuper = false, exclude = {"policies"})
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "PROCESS")
public class Process extends Auditable<String> {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "PROCESS_ID")
    private UUID id;

    @NotNull
    @Column(name = "NAME", nullable = false)
    private String name;

    @NotNull
    @Column(name = "PURPOSE_CODE", nullable = false)
    private String purposeCode;

    @Valid
    @Builder.Default
    @NotNull
    @Type(type = "jsonb")
    @Column(name = "DATA", nullable = false)
    private ProcessData data = new ProcessData();

    @Builder.Default
    @OneToMany(mappedBy = "process")
    private Set<Policy> policies = new HashSet<>();

    // Added outside builder to enforce backreference
    public void addPolicy(Policy policy) {
        if (policy != null) {
            policies.add(policy);
            policy.setProcess(this);
        }
    }

    public boolean isActive() {
        return DateUtil.isNow(data.getStart(), data.getEnd());
    }

    public ProcessResponse convertToResponse() {
        return ProcessResponse.builder()
                .id(id)
                .name(name)
                .description(data.getDescription())
                .purposeCode(purposeCode)
                .department(getDepartmentCode())
                .subDepartment(getSubDepartmentCode())
                .productTeam(data.getProductTeam())
                .products(getProductCodes())
                .start(data.getStart())
                .end(data.getEnd())
                .legalBases(convert(data.getLegalBases(), LegalBasis::convertToResponse))
                .automaticProcessing(data.getAutomaticProcessing())
                .profiling(data.getProfiling())
                .dataProcessing(data.getDataProcessing() == null ? null : DataProcessingResponse.builder()
                        .dataProcessor(data.getDataProcessing().getDataProcessor())
                        .dataProcessorAgreements(nullToEmptyList(data.getDataProcessing().getDataProcessorAgreements()))
                        .dataProcessorOutsideEU(data.getDataProcessing().getDataProcessorOutsideEU())
                        .build())
                .retention(data.getRetention() == null ? null : RetentionResponse.builder()
                        .retentionPlan(data.getRetention().getRetentionPlan())
                        .retentionMonths(data.getRetention().getRetentionMonths())
                        .retentionStart(data.getRetention().getRetentionStart())
                        .retentionDescription(data.getRetention().getRetentionDescription())
                        .build())
                .build();
    }

    public UsedInInstancePurpose getInstanceIdentification() {
        return UsedInInstancePurpose.builder().id(id.toString()).name(name).purposeCode(purposeCode).build();
    }

    public ProcessResponse convertToResponseWithPolicies() {
        var response = convertToResponse();
        response.setPolicies(convert(policies, policy -> policy.convertToResponse(false)));
        return response;
    }

    public Process convertFromRequest(ProcessRequest request) {
        if (!request.isUpdate()) {
            id = UUID.randomUUID();
        }
        setName(request.getName());
        setPurposeCode(request.getPurposeCode());
        data.setDescription(request.getDescription());
        data.setDepartment(request.getDepartment());
        data.setSubDepartment(request.getSubDepartment());
        data.setProductTeam(request.getProductTeam());
        data.setProducts(List.copyOf(request.getProducts()));
        data.setStart(DateUtil.parseStart(request.getStart()));
        data.setEnd(DateUtil.parseEnd(request.getEnd()));
        data.setLegalBases(convert(request.getLegalBases(), LegalBasisRequest::convertToLegalBasis));
        data.setAutomaticProcessing(request.getAutomaticProcessing());
        data.setProfiling(request.getProfiling());
        data.setDataProcessing(convertDataProcessing(request.getDataProcessing()));
        data.setRetention(convertRetention(request.getRetention()));
        return this;
    }

    private static DataProcessing convertDataProcessing(DataProcessingRequest dataProcessing) {
        if (dataProcessing == null) {
            return null;
        }
        return DataProcessing.builder()
                .dataProcessor(dataProcessing.getDataProcessor())
                .dataProcessorAgreements(nullToEmptyList(dataProcessing.getDataProcessorAgreements()))
                .dataProcessorOutsideEU(dataProcessing.getDataProcessorOutsideEU())
                .build();
    }

    private static Retention convertRetention(RetentionRequest retention) {
        if (retention == null) {
            return null;
        }
        return Retention.builder()
                .retentionPlan(retention.getRetentionPlan())
                .retentionMonths(retention.getRetentionMonths())
                .retentionStart(retention.getRetentionStart())
                .retentionDescription(retention.getRetentionDescription())
                .build();
    }

    private CodelistResponse getSubDepartmentCode() {
        return CodelistService.getCodelistResponse(ListName.SUB_DEPARTMENT, data.getSubDepartment());
    }

    private CodelistResponse getDepartmentCode() {
        return CodelistService.getCodelistResponse(ListName.DEPARTMENT, data.getDepartment());
    }

    private List<CodelistResponse> getProductCodes() {
        return CodelistService.getCodelistResponseList(ListName.SYSTEM, data.getProducts());
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class ProcessBuilder {

        public ProcessBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

    }
}
