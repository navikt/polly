package no.nav.data.catalog.backend.app.common.validator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public abstract class RequestValidator<T extends RequestElement> {

    protected List<ValidationError> validateListOfRequests(List<T> requests) {
        List<ValidationError> validationErrors = new ArrayList<>(validateListNotNullOrEmpty(requests));

        if (validationErrors.isEmpty()) {
            validationErrors.addAll(validateThatTheSameElementIsNotDuplicatedInTheRequest(requests));
            validationErrors.addAll(validateThatElementsDoNotUseTheSameIdentifyingFieldsInTheRequest(requests));
        }
        return validationErrors;
    }

    private List<ValidationError> validateListNotNullOrEmpty(List<T> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();
        if (requests == null || requests.isEmpty()) {
            validationErrors.add(new ValidationError("RequestNotAccepted", "RequestWasNullOrEmpty",
                    "The request was not accepted because it is null or empty"));
        }
        return validationErrors;
    }

    private List<ValidationError> validateThatTheSameElementIsNotDuplicatedInTheRequest(List<T> requests) {
        Set requestSet = Set.copyOf(requests);
        if (requestSet.size() < requests.size()) {
            return recordDuplicatedElementsInTheRequest(requests);
        }
        return Collections.emptyList();
    }

    private List<ValidationError> recordDuplicatedElementsInTheRequest(List<T> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();
        Map<String, Integer> elementIdentifierToRequestIndex = new HashMap<>();

        AtomicInteger requestIndex = new AtomicInteger();
        requests.forEach(request -> {
            requestIndex.incrementAndGet();
            String elementIdentifier = request.getIdentifyingFields();
            if (elementIdentifierToRequestIndex.containsKey(elementIdentifier)) {
                validationErrors.add(new ValidationError("Request:" + requestIndex, "DuplicateElement",
                        String.format("The %s %s is not unique because it has already been used in this request (see request:%s)",
                                request.getRequestType(), elementIdentifier, elementIdentifierToRequestIndex.get(elementIdentifier)
                        )));
            } else {
                elementIdentifierToRequestIndex.put(elementIdentifier, requestIndex.intValue());
            }
        });
        return validationErrors;
    }


    private List<ValidationError> validateThatElementsDoNotUseTheSameIdentifyingFieldsInTheRequest(List<T> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();

        requests.stream()
                .filter(element -> requests.stream()
                        .anyMatch(compare -> !element.equals(compare)
                                && element.getIdentifyingFields().equals(compare.getIdentifyingFields())))
                .forEach(element -> validationErrors.add(
                        new ValidationError(element.getIdentifyingFields(), "DuplicatedIdentifyingFields",
                                String.format("Multiple elements in this request are using the same unique fields (%s)", element
                                        .getIdentifyingFields()))));

        return validationErrors.stream().distinct().collect(Collectors.toList());
    }

    protected boolean creatingExistingElement(boolean isUpdate, boolean elementExists) {
        return !isUpdate && elementExists;
    }

    protected boolean updatingNonExistingElement(boolean isUpdate, boolean elementExists) {
        return isUpdate && !elementExists;
    }

    protected boolean updatingExistingElement(boolean isUpdate, boolean elementExists) {
        return isUpdate && elementExists;
    }

}
