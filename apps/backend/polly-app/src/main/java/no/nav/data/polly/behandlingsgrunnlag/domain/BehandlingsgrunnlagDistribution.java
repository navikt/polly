package no.nav.data.polly.behandlingsgrunnlag.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "BEHANDLINGSGRUNNLAG_DISTRIBUTION")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BehandlingsgrunnlagDistribution {

    @Id
    @Column(name = "ID", nullable = false, updatable = false, unique = true)
    private UUID id;

    @Column(name = "PURPOSE", nullable = false, updatable = false)
    private String purpose;

    public static BehandlingsgrunnlagDistribution newForPurpose(String purpose) {
        return new BehandlingsgrunnlagDistribution(UUID.randomUUID(), purpose);
    }
}
