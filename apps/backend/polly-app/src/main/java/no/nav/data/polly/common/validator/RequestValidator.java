package no.nav.data.polly.common.validator;

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public abstract class RequestValidator<T extends RequestElement> {

    public List<ValidationError> validateNoDuplicates(List<T> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();

        validationErrors.addAll(validateThatTheSameElementIsNotDuplicatedInTheRequest(requests));
        validationErrors.addAll(validateThatElementsDoNotUseTheSameIdentifyingFieldsInTheRequest(requests));
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
        Map<String, Integer> identToIndex = new HashMap<>();

        requests.forEach(request -> {
            String ident = request.getIdentifyingFields();
            int index = request.getRequestIndex();
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
                        .anyMatch(compare -> element.getIdentifyingFields().equals(compare.getIdentifyingFields()) && !element.equals(compare)))
                .forEach(element -> validationErrors.add(
                        new ValidationError(element.getIdentifyingFields(), "DuplicatedIdentifyingFields",
                                String.format("Multiple elements in this request are using the same unique fields (%s)", element
                                        .getIdentifyingFields()))));

        return validationErrors.stream().distinct().collect(Collectors.toList());
    }

    protected List<ValidationError> validateFields(T request) {
        return request.validateFields().getErrors();
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
}
