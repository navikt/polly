package no.nav.data.polly.disclosure;

import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.disclosure.domain.Disclosure;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StreamUtils.filter;

@Service
public class DisclosureService extends RequestValidator<DisclosureRequest> {

    private DisclosureRepository repository;
    private InformationTypeRepository informationTypeRepository;

    public DisclosureService(DisclosureRepository repository, InformationTypeRepository informationTypeRepository) {
        this.repository = repository;
        this.informationTypeRepository = informationTypeRepository;
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
                this::validateInformationTypes
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateInformationTypes(DisclosureRequest request) {
        if (request.getInformationTypes().isEmpty()) {
            return List.of();
        }
        List<UUID> ids = convert(request.getInformationTypes(), UUID::fromString);
        var infoTypes = informationTypeRepository.findAllById(ids);
        request.setInformationTypesData(infoTypes);
        var missingInfoTypes = ids.stream().filter(id -> filter(infoTypes, infoType -> ids.contains(infoType.getId())).isEmpty()).collect(Collectors.toList());
        return missingInfoTypes.isEmpty() ? List.of()
                : List.of(new ValidationError(request.getReference(), "informationTypeDoesNotExist", String.format("The InformationTypes %s doesnt exist", missingInfoTypes)));
    }
}
