package no.nav.data.common.validator;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.common.exceptions.CodelistNotFoundException;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.utils.StreamUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
public abstract class RequestValidator<T extends RequestElement> {

    protected List<ValidationError> validateNoDuplicates(List<T> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();

        validationErrors.addAll(validateThatTheSameElementIsNotDuplicatedInTheRequest(requests));
        validationErrors.addAll(validateThatElementsDoNotUseTheSameIdentifyingFieldsInTheRequest(requests));
        return validationErrors;
    }

    private List<ValidationError> validateThatTheSameElementIsNotDuplicatedInTheRequest(List<T> requests) {
        Set<T> requestSet = Set.copyOf(requests);
        if (requestSet.size() < requests.size()) {
            return recordDuplicatedElementsInTheRequest(requests);
        }
        return Collections.emptyList();
    }

    private List<ValidationError> recordDuplicatedElementsInTheRequest(List<T> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();
        Map<String, Integer> identToIndex = new HashMap<>();
        AtomicInteger currentIndex = new AtomicInteger(1);

        requests.forEach(request -> {
            String ident = request.getIdentifyingFields();
            int index = currentIndex.getAndIncrement();
            if (identToIndex.containsKey(ident)) {
                validationErrors.add(new ValidationError("Request:" + index, "DuplicateElement",
                        String.format("The %s %s is not unique because it has already been used in this request (see request:%s)",
                                request.getRequestType(), ident, identToIndex.get(ident)
                        )));
            } else {
                identToIndex.put(ident, index);
            }
        });
        return validationErrors;
    }

    private List<ValidationError> validateThatElementsDoNotUseTheSameIdentifyingFieldsInTheRequest(List<T> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();

        requests.stream()
                .filter(element -> requests.stream() // filter out elements with the same identifying fields but not the same element
                        .anyMatch(compare -> Objects.equals(element.getIdentifyingFields(), compare.getIdentifyingFields()) && !element.equals(compare)))
                .forEach(element -> validationErrors.add(
                        new ValidationError(element.getIdentifyingFields(), "DuplicatedIdentifyingFields",
                                String.format("Multiple elements in this request are using the same unique fields (%s)", element
                                        .getIdentifyingFields()))));

        return validationErrors.stream().distinct().collect(Collectors.toList());
    }

    protected List<ValidationError> validateRepositoryValues(T request, boolean existInRepository) {
        List<ValidationError> validationErrors = new ArrayList<>();
        String capitalizedType = StringUtils.capitalize(request.getRequestType());

        if (creatingExistingElement(request.isUpdate(), existInRepository)) {
            validationErrors.add(new ValidationError(request.getReference(), "creatingExisting" + capitalizedType,
                    String.format("The %s %s already exists and therefore cannot be created", request.getRequestType(), request.getIdentifyingFields())));
        }

        if (updatingNonExistingElement(request.isUpdate(), existInRepository)) {
            validationErrors.add(new ValidationError(request.getReference(), "updatingNonExisting" + capitalizedType,
                    String.format("The %s %s does not exist and therefore cannot be updated", request.getRequestType(), request.getIdentifyingFields())));
        }
        return validationErrors;
    }

    private boolean creatingExistingElement(boolean isUpdate, boolean existInRepository) {
        return !isUpdate && existInRepository;
    }

    private boolean updatingNonExistingElement(boolean isUpdate, boolean existInRepository) {
        return isUpdate && !existInRepository;
    }

    public static void validate(String reference, Validated object) {
        FieldValidator validator = new FieldValidator(reference);
        object.validate(validator);
        validator.ifErrorsThrowValidationException();
    }

    public static void ifErrorsThrowValidationException(List<ValidationError> validationErrors) {
        if (!validationErrors.isEmpty()) {
            log.warn("The request was not accepted. The following errors occurred during validation:{}", validationErrors);
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation:");
        }
    }

    protected void ifErrorsThrowCodelistNotFoundException(List<ValidationError> validationErrors) {
        if (!validationErrors.isEmpty()) {
            String errorMessage = validationErrors.stream().map(ValidationError::toString).collect(Collectors.joining());
            log.warn(errorMessage);
            throw new CodelistNotFoundException(errorMessage);
        }
    }

    protected void initialize(Collection<? extends RequestElement> requests, boolean update) {
        AtomicInteger requestIndex = new AtomicInteger(1);
        requests.forEach(req -> {
            req.setUpdate(update);
            req.setRequestIndex(requestIndex.getAndIncrement());
        });
    }

    protected List<ValidationError> validateObject(String id, Function<UUID, Optional<? extends Auditable>> fetcher, String reference, String type) {
        if (id == null) {
            return List.of();
        }
        return validateObjects(List.of(id), uuids -> fetcher.apply(uuids.get(0)).map(List::of).orElse(List.of()), reference, type);
    }

    protected List<ValidationError> validateObjects(List<String> ids, Function<List<UUID>, List<? extends Auditable>> fetcher, String reference, String type) {
        var errors = new ArrayList<ValidationError>();
        if (!ids.isEmpty()) {
            List<UUID> requestIds = convert(ids, UUID::fromString);
            var objects = fetcher.apply(requestIds);
            if (objects.size() != ids.size()) {
                var missing = StreamUtils.difference(requestIds, convert(objects, Auditable::getId)).getRemoved();
                missing.forEach(m -> errors.add(new ValidationError(reference, type + "DoesNotExist", String.format("The %s %s does not exist", type, m))));
            }
        }
        return errors;
    }
}
