package no.nav.data.polly.common.auditing;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditVersionRepository extends CrudRepository<AuditVersion, UUID> {

}
