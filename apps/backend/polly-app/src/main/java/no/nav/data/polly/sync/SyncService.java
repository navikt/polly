package no.nav.data.polly.sync;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.sync.domain.SyncStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SyncService {

    private final InformationTypeRepository repository;
    private final LeaderElectionService leaderElectionService;

    public SyncService(InformationTypeRepository repository, LeaderElectionService leaderElectionService) {
        this.repository = repository;
        this.leaderElectionService = leaderElectionService;
    }

    public void sync() {
        if (!leaderElectionService.isLeader()) {
            log.info("Skip sync, not leader");
            return;
        }
        var toDelete = repository.findBySyncStatus(SyncStatus.TO_BE_DELETED);
        repository.deleteAll(toDelete);
        log.info("Deleted {} information types", toDelete.size());
    }
}
