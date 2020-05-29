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
import no.nav.data.polly.common.rest.ChangeStampResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.ProcessData.DataProcessing;
import no.nav.data.polly.process.domain.ProcessData.Dpia;
import no.nav.data.polly.process.domain.ProcessData.Retention;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessRequest.DataProcessingRequest;
import no.nav.data.polly.process.dto.ProcessRequest.DpiaRequest;
import no.nav.data.polly.process.dto.ProcessRequest.RetentionRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessResponse.DataProcessingResponse;
import no.nav.data.polly.process.dto.ProcessResponse.DpiaResponse;
import no.nav.data.polly.process.dto.ProcessResponse.RetentionResponse;
import no.nav.data.polly.process.dto.ProcessShortResponse;
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

import static java.util.Comparator.comparing;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;
import static org.springframework.util.CollectionUtils.isEmpty;

@Data
@Builder
@ToString(exclude = {"policies"})
@EqualsAndHashCode(callSuper = false, exclude = {"policies"})
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "PROCESS")
public class Process extends Auditable {

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
                .subDepartments(getSubDepartmentCodes())
                .commonExternalProcessResponsible(getCommonExternalProcessResponsibleCode())
                .productTeamOld(isEmpty(data.getProductTeams()) ? null : data.getProductTeams().get(0))
                .productTeams(data.getProductTeams())
                .products(getProductCodes())
                .start(data.getStart())
                .end(data.getEnd())
                .legalBases(convert(data.getLegalBases(), LegalBasis::convertToResponse))
                .usesAllInformationTypes(data.isUsesAllInformationTypes())
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
                .dpia(data.getDpia() == null ? null : DpiaResponse.builder()
                        .needForDpia(data.getDpia().getNeedForDpia())
                        .refToDpia(data.getDpia().getRefToDpia())
                        .grounds(data.getDpia().getGrounds())
                        .processImplemented(data.getDpia().isProcessImplemented())
                        .riskOwner(data.getDpia().getRiskOwner())
                        .riskOwnerFunction(data.getDpia().getRiskOwnerFunction())
                        .build())
                // If we dont include policies avoid loading them all from DB
                .changeStamp(super.convertChangeStampResponse())
                .status(data.getStatus())
                .build();
    }

    public UsedInInstancePurpose getInstanceIdentification() {
        return UsedInInstancePurpose.builder().id(id.toString()).name(name).purposeCode(purposeCode).build();
    }

    public ProcessResponse convertToResponseWithPolicies() {
        var response = convertToResponse();
        response.setPolicies(convert(policies, policy -> policy.convertToResponse(false)));
        response.setChangeStamp(convertChangeStampResponse());
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
        data.setSubDepartments(List.copyOf(request.getSubDepartments()));
        data.setCommonExternalProcessResponsible(request.getCommonExternalProcessResponsible());
        data.setProductTeams(List.copyOf(request.getProductTeams()));
        data.setProducts(List.copyOf(request.getProducts()));
        data.setStart(DateUtil.parseStart(request.getStart()));
        data.setEnd(DateUtil.parseEnd(request.getEnd()));
        data.setLegalBases(convert(request.getLegalBases(), LegalBasisRequest::convertToDomain));
        data.setUsesAllInformationTypes(request.isUsesAllInformationTypes());
        data.setAutomaticProcessing(request.getAutomaticProcessing());
        data.setProfiling(request.getProfiling());
        data.setDataProcessing(convertDataProcessing(request.getDataProcessing()));
        data.setRetention(convertRetention(request.getRetention()));
        data.setDpia(convertDpia(request.getDpia()));
        data.setStatus(request.getStatus() == null ? null : ProcessStatus.valueOf(request.getStatus()));
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

    private static Dpia convertDpia(DpiaRequest dpia) {
        if (dpia == null) {
            return null;
        }
        return Dpia.builder()
                .needForDpia(dpia.getNeedForDpia())
                .refToDpia(dpia.getRefToDpia())
                .grounds(dpia.getGrounds())
                .processImplemented(dpia.isProcessImplemented())
                .riskOwner(dpia.getRiskOwner())
                .riskOwnerFunction(dpia.getRiskOwnerFunction())
                .build();
    }

    public ProcessShortResponse convertToShortResponse() {
        return new ProcessShortResponse(getId(), getName(), CodelistService.getCodelistResponse(ListName.PURPOSE, purposeCode));
    }

    private CodelistResponse getDepartmentCode() {
        return CodelistService.getCodelistResponse(ListName.DEPARTMENT, data.getDepartment());
    }

    private List<CodelistResponse> getSubDepartmentCodes() {
        return CodelistService.getCodelistResponseList(ListName.SUB_DEPARTMENT, data.getSubDepartments());
    }

    private CodelistResponse getCommonExternalProcessResponsibleCode() {
        return CodelistService.getCodelistResponse(ListName.THIRD_PARTY, data.getCommonExternalProcessResponsible());
    }

    private List<CodelistResponse> getProductCodes() {
        return CodelistService.getCodelistResponseList(ListName.SYSTEM, data.getProducts());
    }

    @Override
    public ChangeStampResponse convertChangeStampResponse() {
        ChangeStampResponse cs = super.convertChangeStampResponse();
        var policyCs = safeStream(getPolicies()).map(Auditable::convertChangeStampResponse).max(comparing(ChangeStampResponse::getLastModifiedDate));
        return policyCs.isPresent() && policyCs.get().getLastModifiedDate().isAfter(cs.getLastModifiedDate()) ? policyCs.get() : cs;
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class ProcessBuilder {

        public ProcessBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

    }
}
