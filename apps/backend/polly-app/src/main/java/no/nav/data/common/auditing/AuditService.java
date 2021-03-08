package no.nav.data.common.auditing;

import no.nav.data.common.auditing.domain.AuditVersionRepository;
import no.nav.data.common.auditing.dto.AuditMetadata;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private final AuditVersionRepository auditVersionRepository;

    public AuditService(AuditVersionRepository auditVersionRepository) {
        this.auditVersionRepository = auditVersionRepository;
    }

    public List<AuditMetadata> lastEditedProcessesByUser(String user) {
        return auditVersionRepository.getLastChangedProcessesByUser(user, 20);
    }
}
