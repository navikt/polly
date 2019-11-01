package no.nav.data.polly.policy.domain;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.elasticsearch.dto.PolicyElasticsearch;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeNameResponse;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.domain.Process;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
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

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.filter;

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
    @Column(name = "PURPOSE_CODE", nullable = false, updatable = false)
    private String purposeCode;

    @Column(name = "SUBJECT_CATEGORIES")
    private String subjectCategories;

    @NotNull
    @Column(name = "START_DATE", nullable = false)
    private LocalDate start;

    @NotNull
    @Column(name = "END_DATE", nullable = false)
    private LocalDate end;

    @NotNull
    @Column(name = "INFORMATION_TYPE_NAME", nullable = false)
    private String informationTypeName;

    @Builder.Default
    @NotNull
    @Column(name = "LEGAL_BASES_INHERITED", nullable = false)
    private boolean legalBasesInherited = false;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "INFORMATION_TYPE_ID", nullable = false, updatable = false)
    private InformationType informationType;

    // Managed by hibernate
    @Setter(AccessLevel.PRIVATE)
    @Column(name = "INFORMATION_TYPE_ID", insertable = false, updatable = false)
    private UUID informationTypeId;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PROCESS_ID", nullable = false, updatable = false)
    private Process process;

    @Valid
    @Type(type = "jsonb")
    @Column(name = "LEGAL_BASES", nullable = false)
    private List<LegalBasis> legalBases = new ArrayList<>();

    public void setInformationType(InformationType informationType) {
        this.informationType = informationType;
        if (informationType != null) {
            this.informationTypeId = informationType.getId();
            this.informationTypeName = informationType.getData().getName();
        }
    }

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

    public PolicyElasticsearch convertToElasticsearch() {
        Codelist purpose = CodelistService.getCodelist(ListName.PURPOSE, purposeCode);
        return PolicyElasticsearch.builder()
                .purpose(purpose.getCode())
                .description(purpose.getDescription())
                .subjectCategories(getSubjectCategories())
                .legalbases(convert(filter(legalBases, LegalBasis::isActive), LegalBasis::convertToElasticsearch))
                .build();
    }

    public PolicyResponse convertToResponse() {
        return PolicyResponse.builder()
                .id(getId())
                .purposeCode(CodelistService.getCodeResponseForCodelistItem(ListName.PURPOSE, getPurposeCode()))
                .subjectCategories(getSubjectCategories())
                .process(getProcess().getName())
                .start(getStart())
                .end(getEnd())
                .informationType(convertInformationTypeNameResponse())
                .legalBasesInherited(isLegalBasesInherited())
                .legalBases(convert(getLegalBases(), LegalBasis::convertToResponse))
                .build();
    }

    private InformationTypeNameResponse convertInformationTypeNameResponse() {
        return getInformationType() != null ? new InformationTypeNameResponse(getInformationTypeId().toString(), getInformationTypeName()) : null;
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class PolicyBuilder {

        private List<LegalBasis> legalBases = new ArrayList<>();

        public PolicyBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

        public PolicyBuilder legalBasis(LegalBasis legalBasis) {
            legalBases.add(legalBasis);
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

        public PolicyBuilder activeToday() {
            start = LocalDate.now();
            end = LocalDate.now();
            return this;
        }
    }

}
