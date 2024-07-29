package no.nav.data.polly.processor;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.exceptions.ValidationException;
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
        return repository.save(processor);
    }

    @Transactional
    public Processor update(ProcessorRequest request) {
        var processor = repository.findById(request.getIdAsUUID()).orElseThrow();
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
