package no.nav.data.polly.disclosure;

import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
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

    private DisclosureRepository repository;
    private DocumentRepository documentRepository;

    public DisclosureService(DisclosureRepository repository, DocumentRepository documentRepository) {
        this.repository = repository;
        this.documentRepository = documentRepository;
    }

    @Transactional
    public Disclosure save(DisclosureRequest request) {
        initialize(List.of(request), false);
        validateRequest(request);
        return repository.save(new Disclosure().convertFromRequest(request));
    }

    @Transactional
    public Disclosure update(DisclosureRequest request) {
        initialize(List.of(request), true);
        validateRequest(request);
        return repository.findById(request.getIdAsUUID()).orElseThrow().convertFromRequest(request);
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
