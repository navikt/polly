package no.nav.data.polly.policy.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.behandlingsgrunnlag.domain.DatasetBehandlingsgrunnlagResponse;
import no.nav.data.polly.codelist.Codelist;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.ListName;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.elasticsearch.domain.PolicyElasticsearch;
import no.nav.data.polly.informationtype.InformationType;
import no.nav.data.polly.legalbasis.LegalBasis;
import no.nav.data.polly.process.Process;
import org.hibernate.annotations.Type;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
@ToString(exclude = {"informationType"})
@EqualsAndHashCode(callSuper = false, exclude = {"informationType"})
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "POLICY")
public class Policy extends Auditable<String> {

    @Id
    @Type(type = "pg-uuid")
    private UUID id;

    @NotNull
    @Column(name = "PURPOSE_CODE", nullable = false, updatable = false)
    private String purposeCode;

    @Column(name = "SUBJECT_CATEGORIES", length = 500)
    private String subjectCategories;

    @NotNull
    @Column(name = "START", nullable = false)
    private LocalDate start;

    @NotNull
    @Column(name = "END", nullable = false)
    private LocalDate end;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "INFORMATION_TYPE_ID", nullable = false, updatable = false)
    private InformationType informationType;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "PROCESS_ID", nullable = false, updatable = false)
    private Process process;

    @Valid
    @Type(type = "jsonb")
    @Column(name = "LEGAL_BASES", nullable = false)
    private Set<LegalBasis> legalBases = new HashSet<>();

    // Added outside builder to enforce backreference
    public Policy addLegalBasis(LegalBasis legalBasis) {
        if (legalBasis != null) {
            legalBases.add(legalBasis);
        }
        return this;
    }

    public DatasetBehandlingsgrunnlagResponse convertToDatasetBehandlingsgrunnlagResponse() {
        return new DatasetBehandlingsgrunnlagResponse(informationType.getId(), informationType.getData().getName(), legalBases.toString());
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
                .legalBasis("merge no.nav.data.polly.legalbasis")
                .build();
    }
}
