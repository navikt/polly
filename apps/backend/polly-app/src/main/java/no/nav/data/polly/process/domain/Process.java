package no.nav.data.polly.process.domain;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.domain.sub.AiUsageDescription;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;
import no.nav.data.polly.process.dto.sub.AiUsageDescriptionRequest;
import no.nav.data.polly.process.dto.sub.DataProcessingRequest;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import static java.util.Comparator.comparing;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.safeStream;
import static no.nav.data.polly.process.domain.sub.Dpia.convertDpia;
import static no.nav.data.polly.process.domain.sub.Retention.convertRetention;

@Data
@Builder
@ToString(exclude = {"policies"})
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "PROCESS")
public class Process extends Auditable {

    @Id
    @Column(name = "PROCESS_ID")
    private UUID id;

    @Valid
    @Builder.Default
    @NotNull
    @Type(value = JsonBinaryType.class)
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

    // TODO: Snu avhengigheten innover
    public ProcessResponse convertToResponse() {
        return ProcessResponse.builder()
                .id(id)
                .number(data.getNumber())
                .name(data.getName())
                .description(data.getDescription())
                .additionalDescription(data.getAdditionalDescription())
                .purposes(getPurposeCodeResponses())
                .affiliation(AffiliationResponse.buildFrom(data.getAffiliation()))
                .commonExternalProcessResponsible(getCommonExternalProcessResponsibleCodeResponse())
                .start(data.getStart())
                .end(data.getEnd())
                .legalBases(convert(data.getLegalBases(), LegalBasis::convertToResponse))
                .usesAllInformationTypes(data.isUsesAllInformationTypes())
                .automaticProcessing(data.getAutomaticProcessing())
                .profiling(data.getProfiling())
                .aiUsageDescription(data.getAiUsageDescription())
                .dataProcessing(DataProcessingResponse.buildFrom(data.getDataProcessing()))                
                .retention(data.getRetention().convertToResponse())
                .dpia(data.getDpia().convertToResponse())
                // If we dont include policies avoid loading them all from DB
                .changeStamp(ChangeStampResponse.from(this))
                .status(data.getStatus())
                .revisionText(data.getRevisionText())
                .build();
    }

    // TODO: Snu avhengigheten innover
    public ProcessResponse convertToResponseWithPolicies() {
        var response = convertToResponse();
        response.setPolicies(convert(policies, policy -> policy.convertToResponse(false)));
        response.setChangeStamp(convertChangeStampResponse());
        return response;
    }

    // TODO: Snu avhengigheten innover
    public Process convertFromRequest(ProcessRequest request) {
        if (!request.isUpdate()) {
            id = UUID.randomUUID();
            data.setNumber(request.getNewProcessNumber());
        }

        data.setName(request.getName());
        data.setPurposes(List.copyOf(request.getPurposes()));
        data.setDescription(request.getDescription());
        data.setAdditionalDescription(request.getAdditionalDescription());
        data.setAffiliation(request.getAffiliation() == null ? new Affiliation() : request.getAffiliation().convertToAffiliation());
        data.setCommonExternalProcessResponsible(request.getCommonExternalProcessResponsible());
        data.setStart(DateUtil.parseStart(request.getStart()));
        data.setEnd(DateUtil.parseEnd(request.getEnd()));
        data.setLegalBases(convert(request.getLegalBases(), LegalBasisRequest::convertToDomain));
        data.setUsesAllInformationTypes(request.isUsesAllInformationTypes());
        data.setAutomaticProcessing(request.getAutomaticProcessing());
        data.setProfiling(request.getProfiling());
        data.setAiUsageDescription(request.getAiUsageDescription() == null ? new AiUsageDescription() : request.getAiUsageDescription().convertToAiUsageDescription());
        data.setDataProcessing(DataProcessingRequest.convertToDataProcessingNullSafe(request.getDataProcessing()));
        data.setRetention(convertRetention(request.getRetention()));
        data.setDpia(convertDpia(request.getDpia()));
        if (request.getStatus() == ProcessStatus.NEEDS_REVISION && data.getStatus() != ProcessStatus.NEEDS_REVISION) {
            data.setStatus(ProcessStatus.IN_PROGRESS);
        } else {
            data.setStatus(request.getStatus());
        }
        if (request.getStatus() != ProcessStatus.NEEDS_REVISION) {
            data.setRevisionText(null);
        }
        return this;
    }

    // TODO: Snu avhengigheten innover
    public ProcessShortResponse convertToShortResponse() {
        return ProcessShortResponse.builder()
                .id(getId())
                .name(data.getName())
                .number(data.getNumber())
                .description(data.getDescription())
                .purposes(getPurposeCodeResponses())
                .affiliation(AffiliationResponse.buildFrom(data.getAffiliation()))
                .commonExternalProcessResponsible(getCommonExternalProcessResponsibleCodeResponse())
                .status(getData().getStatus())
                .end(getData().getEnd())
                .changeStamp(super.convertChangeStampResponse())
                .build();
    }

    // TODO: Snu avhengigheten innover
    public List<CodelistResponse> getPurposeCodeResponses() {
        return CodelistStaticService.getCodelistResponseList(ListName.PURPOSE, data.getPurposes());
    }

    // TODO: Snu avhengigheten innover
    private CodelistResponse getCommonExternalProcessResponsibleCodeResponse() {
        return CodelistStaticService.getCodelistResponse(ListName.THIRD_PARTY, data.getCommonExternalProcessResponsible());
    }

    @Override
    public ChangeStampResponse convertChangeStampResponse() {
        ChangeStampResponse cs = super.convertChangeStampResponse();
        var policyCs = safeStream(getPolicies()).map(Auditable::convertChangeStampResponse).max(comparing(ChangeStampResponse::getLastModifiedDate));
        return policyCs.isPresent() && policyCs.get().getLastModifiedDate().isAfter(cs.getLastModifiedDate()) ? policyCs.get() : cs;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof Process process)) return false;
        return id == process.id; //  Merk: Er dette riktig i alle tilfeller hvis id == process.id == null?
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class ProcessBuilder {

        public ProcessBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

    }
}
