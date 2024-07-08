package no.nav.data.polly.policy.domain;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.UsedInInstancePurpose;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.dto.PolicyRequest;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.domain.Process;
import org.hibernate.annotations.Type;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.polly.codelist.CodelistStaticService.getCodelistResponseList;

@Data
@Builder
@ToString(exclude = {"informationType", "process"})
@EqualsAndHashCode(callSuper = false, exclude = {"informationType", "process"})
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "POLICY")
public class Policy extends Auditable {

    @Id
    @Column(name = "POLICY_ID")
    private UUID id;

    @Valid
    @NotNull
    @Default
    @Type(value = JsonBinaryType.class)
    @Column(name = "DATA", nullable = false)
    private PolicyData data = new PolicyData();

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INFORMATION_TYPE_ID", nullable = false)
    private InformationType informationType;

    // Managed by hibernate
    @Setter(AccessLevel.PRIVATE)
    @Column(name = "INFORMATION_TYPE_ID", insertable = false, updatable = false)
    private UUID informationTypeId;

    @NotNull
    @Column(name = "INFORMATION_TYPE_NAME", nullable = false)
    private String informationTypeName;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PROCESS_ID", nullable = false, updatable = false)
    private Process process;

    public void setInformationType(InformationType informationType) {
        this.informationType = informationType;
        if (informationType != null) {
            this.informationTypeId = informationType.getId();
            this.informationTypeName = informationType.getData().getName();
        }
    }

    // TODO: Snu avhengigheten innover
    public static Policy mapRequestToPolicy(PolicyRequest policyRequest) {
        Policy policy = policyRequest.getExistingPolicy() != null ? policyRequest.getExistingPolicy() : Policy.builder().generateId().data(new PolicyData()).build();
        policyRequest.getInformationType().addPolicy(policy);
        policyRequest.getProcess().addPolicy(policy);
        policy.getData().setPurposes(List.copyOf(policyRequest.getPurposes()));
        policy.getData().setSubjectCategories(List.copyOf(policyRequest.getSubjectCategories()));
        policy.getData().setLegalBasesUse(policyRequest.getLegalBasesUse());
        policy.getData().setLegalBases(convert(policyRequest.getLegalBases(), LegalBasisRequest::convertToDomain));
        policy.getData().setDocumentIds(convert(policyRequest.getDocumentIds(), UUID::fromString));
        return policy;
    }

    // TODO: Snu avhengigheten innover
    public PolicyResponse convertToResponse(boolean includeProcess) {
        return PolicyResponse.builder()
                .id(getId())
                .purposes(getCodelistResponseList(ListName.PURPOSE, getData().getPurposes()))
                .subjectCategories(getCodelistResponseList(ListName.SUBJECT_CATEGORY, getData().getSubjectCategories()))
                .processId(getProcess() == null ? null : getProcess().getId())
                .process(getProcess() == null || !includeProcess ? null : getProcess().convertToResponse())
                .informationTypeId(informationTypeId)
                .informationType(convertInformationTypeShortResponse())
                .legalBasesUse(getData().getLegalBasesUse())
                .legalBases(convert(getData().getLegalBases(), LegalBasis::convertToResponse))
                .documentIds(getData().getDocumentIds())
                .build();
    }

    // TODO: Snu avhengigheten innover
    public UsedInInstancePurpose getInstanceIdentification() {
        return UsedInInstancePurpose.builder().id(id.toString()).processId(process.getId().toString()).name(informationTypeName).purposes(getData().getPurposes()).build();
    }

    // TODO: Snu avhengigheten innover
    private InformationTypeShortResponse convertInformationTypeShortResponse() {
        return getInformationType() == null ? null :
                new InformationTypeShortResponse(getInformationTypeId(), getInformationTypeName(), getInformationType().getData().sensitivityCode());
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class PolicyBuilder {

        public PolicyBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

        public PolicyBuilder informationType(InformationType informationType) {
            this.informationType = informationType;
            if (informationType != null) {
                this.informationTypeId = informationType.getId();
                this.informationTypeName = informationType.getData().getName();
            }
            return this;
        }
    }

}
