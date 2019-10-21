package no.nav.polly.distributionchannel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DistributionChannelRepository extends JpaRepository<DistributionChannel, UUID>, JpaSpecificationExecutor<DistributionChannel> {

    Optional<DistributionChannel> findByName(@Param("name") String name);

    List<DistributionChannel> findAllByNameIn(List<String> names);
}
