package no.nav.data.polly.processor;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.OptimisticLockingUtil;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.processor.domain.Processor;
import no.nav.data.polly.processor.domain.repo.ProcessorRepository;
import no.nav.data.polly.processor.dto.ProcessorRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProcessorService {

    private final ProcessorRepository repository;
    private final ProcessRepository processRepository;

    @Transactional
    public Processor save(Processor processor) {
        // saveAndFlush i tilfelle vi har en omsluttende transaksjon
        return repository.saveAndFlush(processor);
    }

    @Transactional
    public Processor update(ProcessorRequest request) {
        var processor = repository.findById(request.getIdAsUUID())
                .orElseThrow(() -> new NotFoundException("No processor with id=" + request.getIdAsUUID()));
        // Optimistisk låsing: sjekk før mapping. Hibernate øker version selv ved flush.
        OptimisticLockingUtil.checkVersion(processor, request.getVersion());
        processor.convertFromRequest(request);
        return save(processor);
    }

    @Transactional
    public void deleteById(UUID uuid) {
        var processes = processRepository.findByProcessor(uuid);
        if (!processes.isEmpty()) {
            throw new ValidationException("Processor in use by " + processes.size() + " processes");
        }
        repository.deleteById(uuid);
    }

}
