package no.nav.data.polly.processor;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import no.nav.data.polly.processor.domain.Processor;
import no.nav.data.polly.processor.domain.ProcessorData;
import no.nav.data.polly.processor.domain.repo.ProcessorRepository;
import no.nav.data.polly.processor.dto.ProcessorRequest;
import no.nav.data.polly.teams.ResourceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.difference;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;

@Service
@RequiredArgsConstructor
public class ProcessorService extends RequestValidator<ProcessorRequest> {

    // TODO: Denne klassen skal ikke subklasse RequestValidator. Flytt dette ut til en egen komponent (XxxRequestValidator).

    private final ProcessorRepository repository;
    private final ProcessRepository processRepository;
    private final ResourceService resourceService;

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

    // TODO: Snu avhengigheten innover Ikke trivielt å flytte ut (men heller ikke så vanskelig)
    public void validateRequest(ProcessorRequest request, boolean update) {
        initialize(List.of(request), update);

        var existing = Optional.ofNullable(request.getIdAsUUID())
                .flatMap(repository::findById);

        var validationErrors = StreamUtils.applyAll(request,
                RequestElement::validateFields,
                r -> validateRepositoryValues(r, existing.isPresent()),
                r -> validateUsers(r, existing.map(Processor::getData).map(ProcessorData::getOperationalContractManagers).orElse(List.of()), r.getOperationalContractManagers()),
                r -> validateUser(r, existing.map(Processor::getData).map(ProcessorData::getContractOwner), r.getContractOwner())
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateUser(ProcessorRequest request, Optional<String> oldValue, String newValue) {
        return validateUsers(request, nullToEmptyList(oldValue.orElse(null)), nullToEmptyList(newValue));
    }

    private List<ValidationError> validateUsers(ProcessorRequest request, List<String> oldValue, List<String> newValue) {
        var resources = resourceService.getResources(difference(oldValue, newValue).getAdded());
        return resources.entrySet().stream()
                .filter(e -> e.getValue() == null)
                .map(Entry::getKey)
                .map(ident ->
                        new ValidationError(request.getReference(), "invalidResource", "Resource " + ident + " does not exist"))
                .collect(Collectors.toList());
    }
}
