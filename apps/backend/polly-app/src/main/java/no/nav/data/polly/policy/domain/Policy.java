package no.nav.data.polly.policy.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.UsedInInstancePurpose;
import no.nav.data.polly.common.auditing.domain.Auditable;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.dto.PolicyInformationTypeResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.domain.Process;
import org.hibernate.annotations.Type;

import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.codelist.CodelistService.getCodelistResponse;
import static no.nav.data.polly.codelist.CodelistService.getCodelistResponseList;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Data
@Builder
@ToString(exclude = {"informationType", "process"})
@EqualsAndHashCode(callSuper = false, exclude = {"informationType", "process"})
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "POLICY")
public class Policy extends Auditable<String> {

    @Id
    @Type(type = "pg-uuid")
    @Column(name = "POLICY_ID")
    private UUID id;

    @NotNull
    @Column(name = "PURPOSE_CODE", nullable = false)
    private String purposeCode;

    @Valid
    @NotNull
    @Default
    @Type(type = "jsonb")
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

    public boolean isActive() {
        return DateUtil.isNow(getData().getStart(), getData().getEnd());
    }

    public PolicyResponse convertToResponse(boolean includeProcess) {
        return PolicyResponse.builder()
                .id(getId())
                .purposeCode(getCodelistResponse(ListName.PURPOSE, getPurposeCode()))
                .subjectCategories(getCodelistResponseList(ListName.SUBJECT_CATEGORY, getData().getSubjectCategories()))
                .processId(getProcess() == null ? null : getProcess().getId())
                .process(getProcess() == null || !includeProcess ? null : getProcess().convertToResponse())
                .start(getData().getStart())
                .end(getData().getEnd())
                .informationTypeId(informationTypeId)
                .informationType(convertInformationTypeNameResponse())
                .legalBasesInherited(getData().isLegalBasesInherited())
                .legalBases(convert(getData().getLegalBases(), LegalBasis::convertToResponse))
                .documentIds(getData().getDocumentIds())
                .build();
    }

    public UsedInInstancePurpose getInstanceIdentification() {
        return UsedInInstancePurpose.builder().id(id.toString()).name(informationTypeName).purposeCode(purposeCode).build();
    }

    private PolicyInformationTypeResponse convertInformationTypeNameResponse() {
        return getInformationType() == null ? null :
                new PolicyInformationTypeResponse(getInformationTypeId(), getInformationTypeName(), getInformationType().getData().sensitivityCode());
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
