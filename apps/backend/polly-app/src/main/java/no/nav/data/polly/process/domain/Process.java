package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import org.hibernate.annotations.Type;

import java.util.HashSet;
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
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.copyOf;
import static no.nav.data.common.utils.StreamUtils.safeStream;
import static no.nav.data.polly.process.domain.sub.DataProcessing.convertDataProcessing;
import static no.nav.data.polly.process.domain.sub.Dpia.convertDpia;
import static no.nav.data.polly.process.domain.sub.Retention.convertRetention;

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
                .purpose(getPurposeCodeResponse())
                .purposeCode(purposeCode)
                .affiliation(data.affiliation().convertToResponse())
                .commonExternalProcessResponsible(getCommonExternalProcessResponsibleCodeResponse())
                .start(data.getStart())
                .end(data.getEnd())
                .legalBases(convert(data.getLegalBases(), LegalBasis::convertToResponse))
                .usesAllInformationTypes(data.isUsesAllInformationTypes())
                .automaticProcessing(data.getAutomaticProcessing())
                .profiling(data.getProfiling())
                .dataProcessing(data.dataProcessing().convertToResponse())
                .retention(data.retention().convertToResponse())
                .dpia(data.dpia().convertToResponse())
                // If we dont include policies avoid loading them all from DB
                .changeStamp(super.convertChangeStampResponse())
                .status(data.getStatus())
                .build();
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

        var aff = Affiliation.convertFromRequest(request.getAffiliation());
        data.setDepartment(aff.getDepartment());
        data.setSubDepartments(copyOf(aff.getSubDepartments()));
        data.setProductTeams(copyOf(aff.getProductTeams()));
        data.setProducts(copyOf(aff.getProducts()));

        setName(request.getName());
        setPurposeCode(request.getPurposeCode());
        data.setDescription(request.getDescription());
        data.setCommonExternalProcessResponsible(request.getCommonExternalProcessResponsible());
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

    public ProcessShortResponse convertToShortResponse() {
        return ProcessShortResponse.builder()
                .id(getId())
                .name(getName())
                .affiliation(data.affiliation().convertToResponse())
                .purpose(getPurposeCodeResponse())
                .status(getData().getStatus())
                .build();
    }

    private CodelistResponse getPurposeCodeResponse() {
        return CodelistService.getCodelistResponse(ListName.PURPOSE, purposeCode);
    }

    private CodelistResponse getCommonExternalProcessResponsibleCodeResponse() {
        return CodelistService.getCodelistResponse(ListName.THIRD_PARTY, data.getCommonExternalProcessResponsible());
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
