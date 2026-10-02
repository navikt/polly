package no.nav.data.polly.process.dpprocess;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.utils.OptimisticLockingUtil;
import no.nav.data.polly.process.dpprocess.domain.DpProcess;
import no.nav.data.polly.process.dpprocess.domain.repo.DpProcessRepository;
import no.nav.data.polly.process.dpprocess.dto.DpProcessRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DpProcessService {

    private final DpProcessRepository repository;

    @Transactional
    public DpProcess save(DpProcess process) {
        // Flush i tilfelle vi har en omsluttende transaksjon
        return repository.saveAndFlush(process);
    }

    @Transactional
    public DpProcess update(DpProcessRequest request) {
        var dpProcess = repository.findById(request.getIdAsUUID()).orElseThrow();
        // Optimistisk låsing: sjekk før mapping. Hibernate øker version selv ved flush.
        OptimisticLockingUtil.checkVersion(dpProcess, request.getVersion());
        dpProcess.convertFromRequest(request);
        return repository.saveAndFlush(dpProcess);
    }

    @Transactional
    public void deleteById(UUID uuid) {
        // FIXME: Mangler Opt lock ?
        repository.deleteById(uuid);
    }

}
