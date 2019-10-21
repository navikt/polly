package no.nav.data.polly.behandlingsgrunnlag;

import no.nav.data.polly.behandlingsgrunnlag.domain.BehandlingsgrunnlagDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BehandlingsgrunnlagDistributionRepository extends JpaRepository<BehandlingsgrunnlagDistribution, UUID> {

}