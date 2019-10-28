package no.nav.data.polly.term;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestValidator;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class TermService extends RequestValidator<TermRequest> {

    private TermRepository termRepository;

    public TermService(TermRepository termRepository) {
        this.termRepository = termRepository;
    }

    void validateRequest(List<TermRequest> requests) {
        var validationErrors = StreamUtils.applyAll(requests,
                req -> validateRepositoryValues(req, termRepository.findByName(req.getName()).isPresent()),
                this::validateFields
        );

        if (!validationErrors.isEmpty()) {
            log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrors);
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
        }
    }
}
