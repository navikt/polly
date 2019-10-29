package no.nav.data.polly.policy.entities;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import no.nav.data.polly.codelist.Codelist;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.ListName;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.elasticsearch.domain.PolicyElasticsearch;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.LegalBasis;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.purpose.domain.InformationTypePurposeResponse;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
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
    @Builder.Default
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

    public InformationTypePurposeResponse convertToPurposeResponse() {
        return new InformationTypePurposeResponse(informationType.getId(), informationTypeName, convert(legalBases, LegalBasis::convertToResponse));
    }

    public boolean isActive() {
        return (start == null || start.minusDays(1).isBefore(LocalDate.now())) &&
                (end == null || end.plusDays(1).isAfter(LocalDate.now()));
    }

    public PolicyElasticsearch convertToElasticsearch() {
        Codelist purpose = CodelistService.getCodelist(ListName.PURPOSE, purposeCode);
        return PolicyElasticsearch.builder()
                .purpose(purpose.getCode())
                .description(purpose.getDescription())
                .subjectCategories(getSubjectCategories())
                .legalbases(convert(legalBases, LegalBasis::convertToElasticsearch))
                .build();
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
            }
            return this;
        }
    }

}
