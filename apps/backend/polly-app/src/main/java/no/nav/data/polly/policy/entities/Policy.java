package no.nav.data.polly.policy.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.behandlingsgrunnlag.domain.DatasetBehandlingsgrunnlagResponse;
import no.nav.data.polly.codelist.Codelist;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.ListName;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.elasticsearch.domain.PolicyElasticsearch;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "POLICY")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Policy extends Auditable<String> {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_policy")
    @GenericGenerator(name = "seq_policy", strategy = "org.hibernate.id.enhanced.SequenceStyleGenerator",
            parameters = {@Parameter(name = "sequence_name", value = "SEQ_POLICY")})
    @Column(name = "POLICY_ID", nullable = false, updatable = false, unique = true)
    private Long policyId;

    @NotNull
    @Column(name = "DATASET_ID", nullable = false)
    private String datasetId;

    @Column(name = "DATASET_TITLE")
    private String datasetTitle;

    @NotNull
    @Column(name = "PURPOSE_CODE", nullable = false)
    private String purposeCode;

    @Column(name = "LEGAL_BASIS_DESCRIPTION", length = 500)
    private String legalBasisDescription;

    @NotNull
    @Column(name = "FOM", nullable = false)
    private LocalDate fom;

    @NotNull
    @Column(name = "TOM", nullable = false)
    private LocalDate tom;

    public DatasetBehandlingsgrunnlagResponse convertToDatasetBehandlingsgrunnlagResponse() {
        return new DatasetBehandlingsgrunnlagResponse(datasetId, datasetTitle, legalBasisDescription);
    }

    public boolean isActive() {
        return (fom == null || fom.minusDays(1).isBefore(LocalDate.now())) &&
                (tom == null || tom.plusDays(1).isAfter(LocalDate.now()));
    }

    public PolicyElasticsearch convertToElasticsearch() {
        Codelist purpose = CodelistService.getCodelist(ListName.PURPOSE, purposeCode);
        return PolicyElasticsearch.builder()
                .purpose(purpose.getCode())
                .description(purpose.getDescription())
                .legalBasis(getLegalBasisDescription())
                .build();
    }
}
