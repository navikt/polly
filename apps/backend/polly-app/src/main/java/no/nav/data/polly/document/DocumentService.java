package no.nav.data.polly.document;

import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentData.InformationTypeUse;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.document.dto.DocumentInfoTypeResponse;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.policy.domain.PolicyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.filter;

@Service
public class DocumentService extends RequestValidator<DocumentRequest> {

    private final DocumentRepository repository;
    private final InformationTypeRepository informationTypeRepository;
    private final PolicyRepository policyRepository;

    public DocumentService(DocumentRepository repository, InformationTypeRepository informationTypeRepository, PolicyRepository policyRepository) {
        this.repository = repository;
        this.informationTypeRepository = informationTypeRepository;
        this.policyRepository = policyRepository;
    }

    public DocumentResponse getDocumentAsResponse(UUID uuid) {
        var document = repository.findById(uuid).orElseThrow(() -> new PollyNotFoundException("Document " + uuid + " not found"));
        DocumentResponse response = document.convertToResponse();
        Map<UUID, DocumentInfoTypeResponse> informationTypes = getInformationTypes(document);
        response.getInformationTypes().forEach(it -> it.setInformationType(informationTypes.get(it.getInformationTypeId())));
        return response;
    }

    public Map<UUID, DocumentInfoTypeResponse> getInformationTypes(Document document) {
        return informationTypeRepository.findAllById(convert(document.getData().getInformationTypes(), InformationTypeUse::getInformationTypeId))
                .stream()
                .map(Document::convertToInformationTypeResponse)
                .collect(Collectors.toMap(DocumentInfoTypeResponse::getId, Function.identity()));
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

    public Document delete(UUID uuid) {
        var doc = repository.findById(uuid).orElseThrow(() -> new PollyNotFoundException("Couldn't find document " + uuid));
        var policies = policyRepository.findByDocumentId(uuid);
        if (!policies.isEmpty()) {
            throw new ValidationException(String.format("Document %s is used by %d policie(s)", uuid, policies.size()));
        }
        repository.delete(doc);
        return doc;
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
        if (request.getInformationTypes().isEmpty()) {
            return List.of();
        }
        List<UUID> ids = convert(request.getInformationTypes(), infoType -> UUID.fromString(infoType.getInformationTypeId()));
        var infoTypes = informationTypeRepository.findAllById(ids);
        var missingInfoTypes = ids.stream().filter(id -> filter(infoTypes, infoType -> ids.contains(infoType.getId())).isEmpty()).collect(Collectors.toList());
        return missingInfoTypes.isEmpty() ? List.of()
                : List.of(new ValidationError(request.getReference(), "informationTypeDoesNotExist", String.format("The InformationTypes %s doesnt exist", missingInfoTypes)));
    }
}
