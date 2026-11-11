package no.nav.data.polly.databehandler.dto;

import lombok.RequiredArgsConstructor;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.ValidationError;
import no.nav.data.polly.databehandler.domain.Databehandler;
import no.nav.data.polly.databehandler.domain.DatabehandlerData;
import no.nav.data.polly.databehandler.domain.repo.DatabehandlerRepository;
import no.nav.data.polly.teams.ResourceService;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.difference;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;

@Component
@RequiredArgsConstructor
public class DatabehandlerRequestValidator extends RequestValidator<DatabehandlerRequest> {

    // MERK: Ingen testdekning
    
    private final DatabehandlerRepository repository;
    private final ResourceService resourceService;

    public void validateRequest(DatabehandlerRequest request, boolean update) {
        initialize(List.of(request), update);

        var existing = Optional.ofNullable(request.getIdAsUUID())
                .flatMap(repository::findById);

        var validationErrors = StreamUtils.applyAll(request,
                RequestElement::validateFields,
                r -> validateRepositoryValues(r, existing.isPresent()),
                r -> validateUsers(r, existing.map(Databehandler::getData).map(DatabehandlerData::getFagansvarlig).orElse(List.of()), r.getFagansvarlig()),
                r -> validateUser(r, existing.map(Databehandler::getData).map(DatabehandlerData::getAvtaleeier), r.getAvtaleeier())
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateUser(DatabehandlerRequest request, Optional<String> oldValue, String newValue) {
        return validateUsers(request, nullToEmptyList(oldValue.orElse(null)), nullToEmptyList(newValue));
    }

    private List<ValidationError> validateUsers(DatabehandlerRequest request, List<String> oldValue, List<String> newValue) {
        var resources = resourceService.getResources(difference(oldValue, newValue).getAdded());
        return resources.entrySet().stream()
                .filter(e -> e.getValue() == null)
                .map(Entry::getKey)
                .map(ident -> new ValidationError(request.getReference(), "invalidResource", "Resource " + ident + " does not exist"))
                .collect(Collectors.toList());
    }
}
