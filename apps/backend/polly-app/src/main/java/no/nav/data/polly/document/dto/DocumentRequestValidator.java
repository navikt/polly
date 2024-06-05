package no.nav.data.polly.document.dto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentData.InformationTypeUse;
import no.nav.data.polly.document.domain.DocumentRepository;
import no.nav.data.polly.document.dto.DocumentRequest;
import no.nav.data.polly.document.dto.DocumentResponse;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.settings.SettingsService;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.filter;

@Slf4j
@Component
@RequiredArgsConstructor
public class DocumentRequestValidator extends RequestValidator<DocumentRequest> { 

    private final DocumentRepository repository;
    private final InformationTypeRepository informationTypeRepository;

    public void validateRequest(DocumentRequest request, boolean update) {
        initialize(List.of(request), update);
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
        List<UUID> ids = convert(filter(request.getInformationTypes(), it ->
                isValidUUID(it.getInformationTypeId())), infoType -> UUID.fromString(infoType.getInformationTypeId()));
        var infoTypes = informationTypeRepository.findAllById(ids);
        var missingInfoTypes = ids.stream().filter(id -> filter(infoTypes, infoType -> ids.contains(infoType.getId())).isEmpty()).collect(Collectors.toList());
        return missingInfoTypes.isEmpty() ? List.of()
                : List.of(new ValidationError(request.getReference(), "informationTypeDoesNotExist", String.format("The InformationTypes %s doesnt exist", missingInfoTypes)));
    }

    private boolean isValidUUID(String uuid) {
        try {
            UUID.fromString(uuid);
            return true;
        } catch (Exception e) {
            log.trace("invalid uuid " + uuid, e);
            return false;
        }
    }
    
}
