package no.nav.data.polly.process;

import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.process.domain.DpProcess;
import no.nav.data.polly.process.domain.repo.DpProcessRepository;
import no.nav.data.polly.process.dto.DpProcessRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.lang.String.format;

@Service
public class DpProcessService extends RequestValidator<DpProcessRequest> {

    private final DpProcessRepository repository;

    public DpProcessService(DpProcessRepository repository) {
        this.repository = repository;
    }

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

    public void validateRequest(DpProcessRequest request, boolean update) {
        initialize(List.of(request), update);

        var validationErrors = StreamUtils.applyAll(request,
                RequestElement::validateFields,
                this::validateProcessRepositoryValues
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateProcessRepositoryValues(DpProcessRequest request) {
        var validations = new ArrayList<ValidationError>();
        if (request.isUpdate()) {
            var repoValue = Optional.ofNullable(request.getIdAsUUID()).flatMap(repository::findById);
            validations.addAll(validateRepositoryValues(request, repoValue.isPresent()));
        } else {
            validations.addAll(validateRepositoryValues(request, false));
        }
        Optional<DpProcess> byName = repository.findByName(request.getName()).filter(p -> !p.getId().equals(request.getIdAsUUID()));
        if (byName.isPresent()) {
            validations.add(new ValidationError(request.getReference(), "nameAndPurposeExists",
                    format("DpProcess with name %s already exists", request.getName())));
        }
        return validations;
    }
}
