package no.nav.data.polly.process.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProcessDistributionRepository extends JpaRepository<ProcessDistribution, UUID> {

}