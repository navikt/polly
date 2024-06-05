package no.nav.data.polly.process.dpprocess;

import lombok.RequiredArgsConstructor;
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
        return repository.save(process);
    }

    @Transactional
    public DpProcess update(DpProcessRequest request) {
        var dpProcess = repository.findById(request.getIdAsUUID()).orElseThrow();
        dpProcess.convertFromRequest(request);
        return save(dpProcess);
    }

    @Transactional
    public void deleteById(UUID uuid) {
        repository.deleteById(uuid);
    }

}
