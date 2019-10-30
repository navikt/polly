package no.nav.data.polly.term;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.term.domain.TermRepository;
import no.nav.data.polly.term.dto.TermRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class TermService extends RequestValidator<TermRequest> {

    private TermRepository termRepository;

    public TermService(TermRepository termRepository) {
        this.termRepository = termRepository;
    }

    void validateRequest(List<TermRequest> requests, boolean update) {
        initialize(requests, update);
        var validationErrors = StreamUtils.applyAll(requests,
                req -> validateRepositoryValues(req, termRepository.findByName(req.getName()).isPresent()),
                this::validateFields
        );

        checkForErrors(validationErrors);
    }
}
