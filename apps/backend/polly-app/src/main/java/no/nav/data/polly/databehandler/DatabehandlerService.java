package no.nav.data.polly.databehandler;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.OptimisticLockingUtil;
import no.nav.data.polly.databehandler.domain.Databehandler;
import no.nav.data.polly.databehandler.domain.repo.DatabehandlerRepository;
import no.nav.data.polly.databehandler.dto.DatabehandlerRequest;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DatabehandlerService {

    private final DatabehandlerRepository repository;
    private final ProcessRepository processRepository;

    @Transactional
    public Databehandler save(Databehandler databehandler) {
        // saveAndFlush i tilfelle vi har en omsluttende transaksjon
        return repository.saveAndFlush(databehandler);
    }

    @Transactional
    public Databehandler update(DatabehandlerRequest request) {
        var databehandler = repository.findById(request.getIdAsUUID())
                .orElseThrow(() -> new NotFoundException("No databehandler with id=" + request.getIdAsUUID()));
        // Optimistisk låsing: sjekk før mapping. Hibernate øker version selv ved flush.
        OptimisticLockingUtil.checkVersion(databehandler, request.getVersion());
        databehandler.convertFromRequest(request);
        return save(databehandler);
    }

    @Transactional
    public Databehandler deleteById(UUID uuid, Integer expectedVersion) {
        var databehandler = repository.findById(uuid).orElseThrow(() -> new NotFoundException("No databehandler with id=" + uuid));
        var processes = processRepository.findByProcessor(uuid); // TODO: databehandler
        if (!processes.isEmpty()) {
            throw new ValidationException("Databehandler in use by " + processes.size() + " processes");
        }
        OptimisticLockingUtil.checkVersion(databehandler, expectedVersion);
        repository.deleteById(uuid);
        return databehandler;
    }

}
