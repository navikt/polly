package no.nav.data.catalog.backend.app.codelist;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.CodelistNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.common.validator.RequestValidator;
import no.nav.data.catalog.backend.app.common.validator.ValidateFieldsInRequestNotNullOrEmpty;
import no.nav.data.catalog.backend.app.common.validator.ValidationError;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;

@Slf4j
@Service
public class CodelistService extends RequestValidator<CodelistRequest> {

    private CodelistRepository repository;

    public static final Map<ListName, Map<String, String>> codelists = new EnumMap<>(ListName.class);

    static {
        initListNames();
    }

    public CodelistService(CodelistRepository repository) {
        this.repository = repository;
    }

    private static CodeResponse getCodeInfoForCodelistItem(ListName listName, String code) {
        return new CodeResponse(code, codelists.get(listName).get(code));
    }

    public static List<CodeResponse> getCodeInfoForCodelistItems(ListName listName, Collection<String> codes) {
        return StreamUtils.safeStream(codes)
                .map(code -> getCodeInfoForCodelistItem(listName, code))
                .collect(Collectors.toList());
    }

    @PostConstruct
    public void refreshCache() {
        List<Codelist> allCodelists = repository.findAll();
        initListNames();
        allCodelists.forEach(codelist -> codelists.get(codelist.getList()).put(codelist.getCode(), codelist.getDescription()));
    }

    private static void initListNames() {
        Stream.of(ListName.values()).forEach(listName -> codelists.put(listName, new HashMap<>()));
    }

    public List<Codelist> save(List<CodelistRequest> requests) {
        requests.forEach(request -> codelists.get(request.getListAsListName())
                .put(request.getCode(), request.getDescription()));
        return repository.saveAll(requests.stream()
                .map(CodelistRequest::convert)
                .collect(Collectors.toList()));
    }

    public List<Codelist> update(List<CodelistRequest> requests) {
        requests.forEach(request -> codelists.get(request.getListAsListName())
                .put(request.getCode(), request.getDescription()));

        return repository.saveAll(requests.stream()
                .map(this::updateDescriptionInRepository)
                .collect(Collectors.toList()));
    }

    private Codelist updateDescriptionInRepository(CodelistRequest request) {
        Optional<Codelist> optionalCodelist = repository.findByListAndCode(request.getListAsListName(), request.getCode());
        if (optionalCodelist.isPresent()) {
            Codelist codelist = optionalCodelist.get();
            codelist.setDescription(request.getDescription());
            return codelist;
        }
        log.error("Cannot find codelist with code={} in list={}", request.getCode(), request.getList());
        throw new CodelistNotFoundException(String.format(
                "Cannot find codelist with code=%s in list=%s", request.getCode(), request.getList()));
    }

    public void delete(ListName name, String code) {
        Optional<Codelist> toDelete = repository.findByListAndCode(name, code);
        if (toDelete.isPresent()) {
            repository.delete(toDelete.get());
            codelists.get(name).remove(code);
        } else {
            log.error("Cannot find a codelist to delete with code={} and listName={}", code, name);
            throw new IllegalArgumentException(
                    String.format("Cannot find a codelist to delete with code=%s and listName=%s", code, name));
        }
    }

    public void validateListNameExists(String listName) {
        if (nonValidListName(listName)) {
            log.error("Codelist with listName={} does not exits", listName);
            throw new CodelistNotFoundException(String.format("Codelist with listName=%s does not exist", listName));
        }
    }

    public void validateListNameAndCodeExists(String listName, String code) {
        validateListNameExists(listName);
        if (!codelists.get(ListName.valueOf(listName.toUpperCase())).containsKey(code.toUpperCase())) {
            log.error("The code={} does not exist in the list={}.", code, listName);
            throw new CodelistNotFoundException(String.format("The code=%s does not exist in the list=%s.", code, listName));
        }
    }

    private boolean nonValidListName(String listName) {
        Optional<ListName> optionalListName = Arrays.stream(ListName.values())
                .filter(x -> x.toString().equalsIgnoreCase(listName))
                .findFirst();
        return optionalListName.isEmpty();
    }

    public void validateRequest(List<CodelistRequest> requests, boolean isUpdate) {
        List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests, isUpdate);

        if (!validationErrors.isEmpty()) {
            log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrors);
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
        }
    }

    private List<ValidationError> validateRequestsAndReturnErrors(List<CodelistRequest> requests, boolean isUpdate) {
        List<ValidationError> validationErrors = new ArrayList<>(validateListOfRequests(requests));

        if (validationErrors.isEmpty()) {
            validationErrors.addAll(validateCodelistRequest(requests, isUpdate));
        }
        return validationErrors;
    }

    private List<ValidationError> validateCodelistRequest(List<CodelistRequest> requests, boolean isUpdate) {
        List<ValidationError> validationErrors = new ArrayList<>();
        AtomicInteger requestIndex = new AtomicInteger();

        requests.forEach(request -> {
            requestIndex.incrementAndGet();
            String reference = "Request:" + requestIndex.toString();

            List<ValidationError> errorsInCurrentRequest = validateThatNoFieldsAreNullOrEmpty(request, reference);

            if (errorsInCurrentRequest.isEmpty()) {  // to avoid NPE in current request
                request.toUpperCaseAndTrim();
                errorsInCurrentRequest.addAll(validListName(request.getList(), reference));
                errorsInCurrentRequest.addAll(validateRepositoryValues(request, isUpdate, reference));
            }

            if (!errorsInCurrentRequest.isEmpty()) {
                validationErrors.addAll(errorsInCurrentRequest);
            }
        });
        return validationErrors;
    }

    private List<ValidationError> validateThatNoFieldsAreNullOrEmpty(CodelistRequest request, String reference) {
        ValidateFieldsInRequestNotNullOrEmpty nullOrEmpty = new ValidateFieldsInRequestNotNullOrEmpty(reference);

        nullOrEmpty.checkField("listName", request.getList());
        nullOrEmpty.checkField("code", request.getCode());
        nullOrEmpty.checkField("description", request.getDescription());

        return nullOrEmpty.getErrors();
    }

    private List<ValidationError> validListName(String list, String reference) {
        List<ValidationError> validationErrors = new ArrayList<>();
        if (nonValidListName(list)) {
            validationErrors.add(new ValidationError(reference, "invalidListName",
                    String.format("The ListName %s does not exists", list)));
        }
        return validationErrors;
    }

    private List<ValidationError> validateRepositoryValues(CodelistRequest request, boolean isUpdate, String reference) {
        List<ValidationError> validationErrors = new ArrayList<>();
        Optional<Codelist> existingCodelist = repository.findByListAndCode(request.getListAsListName(), request.getCode());

        if (creatingExistingElement(isUpdate, existingCodelist.isPresent())) {
            validationErrors.add(new ValidationError(reference, "creatingExistingCodelist",
                    String.format("The codelist %s already exists and therefore cannot be created", request.getIdentifyingFields())));
        }
        if (updatingNonExistingElement(isUpdate, existingCodelist.isPresent())) {
            validationErrors.add(new ValidationError(reference, "updatingNonExistingCodelist",
                    String.format("The codelist %s does not exist and therefore cannot be updated", request.getIdentifyingFields())));
        }
        return validationErrors;
    }
}