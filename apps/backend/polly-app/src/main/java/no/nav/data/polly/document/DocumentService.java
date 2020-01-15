package no.nav.data.polly.document;

import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.document.dto.DocumentInformationTypeResponse;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.filter;

@Service
public class DocumentService extends RequestValidator<DocumentRequest> {

    private DocumentRepository repository;
    private InformationTypeRepository informationTypeRepository;

    public DocumentService(DocumentRepository repository, InformationTypeRepository informationTypeRepository) {
        this.repository = repository;
        this.informationTypeRepository = informationTypeRepository;
    }

    public DocumentResponse getDocument(UUID uuid) {
        var document = repository.findById(uuid).orElseThrow(() -> new PollyNotFoundException("Document " + uuid + " not found"));
        DocumentResponse response = document.convertToResponse();
        response.setInformationTypes(getInformationTypes(document));
        return response;
    }

    public List<DocumentInformationTypeResponse> getInformationTypes(Document document) {
        var infoTypes = informationTypeRepository.findAllById(document.getData().getInformationTypeIds());
        return convert(infoTypes, Document::convertInformationTypeResponse);
    }

    @Transactional
    public Document save(DocumentRequest request) {
        initialize(List.of(request), false);
        validateRequest(request);
        return repository.save(new Document().convertFromRequest(request));
    }

    @Transactional
    public Document update(DocumentRequest request) {
        initialize(List.of(request), true);
        validateRequest(request);
        return repository.findById(request.getIdAsUUID()).orElseThrow().convertFromRequest(request);
    }

    private void validateRequest(DocumentRequest request) {
        var validationErrors = StreamUtils.applyAll(request,
                RequestElement::validateFields,
                r -> validateRepositoryValues(r, r.getIdAsUUID() != null && repository.findById(r.getIdAsUUID()).isPresent()),
                this::validateInformationTypes
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateInformationTypes(DocumentRequest request) {
        if (request.getInformationTypeIds().isEmpty()) {
            return List.of();
        }
        List<UUID> ids = convert(request.getInformationTypeIds(), UUID::fromString);
        var infoTypes = informationTypeRepository.findAllById(ids);
        var missingInfoTypes = ids.stream().filter(id -> filter(infoTypes, infoType -> ids.contains(infoType.getId())).isEmpty()).collect(Collectors.toList());
        return missingInfoTypes.isEmpty() ? List.of()
                : List.of(new ValidationError(request.getReference(), "informationTypeDoesNotExist", String.format("The InformationTypes %s doesnt exist", missingInfoTypes)));
    }
}
