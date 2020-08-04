package no.nav.data.polly.disclosure;

import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.alert.AlertService;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.document.domain.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.apache.commons.lang3.StringUtils.isBlank;

@Service
public class DisclosureService extends RequestValidator<DisclosureRequest> {

    private final DisclosureRepository repository;
    private final DocumentRepository documentRepository;
    private final AlertService alertService;

    public DisclosureService(DisclosureRepository repository, DocumentRepository documentRepository, AlertService alertService) {
        this.repository = repository;
        this.documentRepository = documentRepository;
        this.alertService = alertService;
    }

    @Transactional
    public Disclosure save(DisclosureRequest request) {
        initialize(List.of(request), false);
        validateRequest(request);
        Disclosure disclosure = repository.save(new Disclosure().convertFromRequest(request));
        alertService.calculateEventsForDisclosure(disclosure);
        return disclosure;
    }

    @Transactional
    public Disclosure update(DisclosureRequest request) {
        initialize(List.of(request), true);
        validateRequest(request);
        Disclosure disclosure = repository.findById(request.getIdAsUUID()).orElseThrow().convertFromRequest(request);
        alertService.calculateEventsForDisclosure(disclosure);
        return disclosure;
    }

    @Transactional
    public void deleteById(UUID id) {
        repository.deleteById(id);
        alertService.deleteEventsForDisclosure(id);
    }

    private void validateRequest(DisclosureRequest request) {
        var validationErrors = StreamUtils.applyAll(request,
                RequestElement::validateFields,
                r -> validateRepositoryValues(r, r.getIdAsUUID() != null && repository.findById(r.getIdAsUUID()).isPresent()),
                this::validateDocument
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateDocument(DisclosureRequest request) {
        return isBlank(request.getDocumentId()) || documentRepository.findById(UUID.fromString(request.getDocumentId())).isPresent() ? List.of()
                : List.of(new ValidationError(request.getReference(), "documentDoesNotExist", String.format("The Document %s doesnt exist", request.getDocumentId())));
    }
}
