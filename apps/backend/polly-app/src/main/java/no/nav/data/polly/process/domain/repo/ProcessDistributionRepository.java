package no.nav.data.polly.process.domain.repo;

import no.nav.data.polly.process.domain.ProcessDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProcessDistributionRepository extends JpaRepository<ProcessDistribution, UUID> {

}