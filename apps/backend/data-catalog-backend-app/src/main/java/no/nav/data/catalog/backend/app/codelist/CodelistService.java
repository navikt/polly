package no.nav.data.catalog.backend.app.codelist;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.CodelistNotFoundException;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.common.utils.StreamUtils;
import no.nav.data.catalog.backend.app.common.validator.FieldValidator;
import no.nav.data.catalog.backend.app.common.validator.RequestValidator;
import no.nav.data.catalog.backend.app.common.validator.ValidationError;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

@Slf4j
@Service
public class CodelistService extends RequestValidator<CodelistRequest> {

    private CodelistRepository repository;

    static {
        CodelistCache.init();
    }

    public CodelistService(CodelistRepository repository) {
        this.repository = repository;
    }

    public static Codelist getCodelist(ListName listName, String code) {
        return CodelistCache.getCodelist(listName, code);
    }

    public static CodeResponse getCodeResponseForCodelistItem(ListName listName, String code) {
        Codelist codelist = getCodelist(listName, code);
        if (codelist == null) {
            return null;
        }
        return new CodeResponse(codelist.getCode(), codelist.getDescription());
    }

    public static List<CodeResponse> getCodeResponseForCodelistItems(ListName listName, Collection<String> codes) {
        return StreamUtils.safeStream(codes)
                .map(code -> getCodeResponseForCodelistItem(listName, code))
                .collect(Collectors.toList());
    }

    @PostConstruct
    public void refreshCache() {
        List<Codelist> allCodelists = repository.findAll();
        CodelistCache.init();
        allCodelists.forEach(CodelistCache::set);
    }

    public List<Codelist> save(List<CodelistRequest> requests) {
        requests.forEach(request -> CodelistCache.set(request.convert()));
        return repository.saveAll(requests.stream()
                .map(CodelistRequest::convert)
                .collect(Collectors.toList()));
    }

    public List<Codelist> update(List<CodelistRequest> requests) {
        requests.forEach(request -> CodelistCache.set(request.convert()));

        return repository.saveAll(requests.stream()
                .map(this::updateDescriptionInRepository)
                .collect(Collectors.toList()));
    }

    private Codelist updateDescriptionInRepository(CodelistRequest request) {
        Optional<Codelist> optionalCodelist = repository.findByListAndNormalizedCode(request.getListAsListName(), request.getNormalizedCode());
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
        Optional<Codelist> toDelete = repository.findByListAndNormalizedCode(name, Codelist.normalize(code));
        if (toDelete.isPresent()) {
            repository.delete(toDelete.get());
            CodelistCache.remove(name, code);
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
        if (!CodelistCache.contains(ListName.valueOf(listName.toUpperCase()), code)) {
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
        requests = StreamUtils.nullToEmptyList(requests);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }
        List<ValidationError> validationErrors = new ArrayList<>(validateNoDuplicates(requests));
        prepareCodelistRequestForValidation(requests, isUpdate);
        validationErrors.addAll(validateCodelistRequest(requests));
        return validationErrors;
    }

    private void prepareCodelistRequestForValidation(List<CodelistRequest> requests, boolean isUpdate) {
        AtomicInteger requestIndex = new AtomicInteger();

        requests.forEach(request -> {
            request.setUpdate(isUpdate);
            request.setRequestIndex(requestIndex.incrementAndGet());
        });
    }

    private List<ValidationError> validateCodelistRequest(List<CodelistRequest> requests) {
        List<ValidationError> validationErrors = new ArrayList<>();

        requests.forEach(request -> {
            List<ValidationError> errorsInCurrentRequest = validateThatNoFieldsAreNullOrEmpty(request);
            request.toUpperCaseAndTrim();
            errorsInCurrentRequest.addAll(validListName(request.getList(), request.getReference()));
            errorsInCurrentRequest.addAll(validateRepositoryValues(request));

            if (!errorsInCurrentRequest.isEmpty()) {
                validationErrors.addAll(errorsInCurrentRequest);
            }
        });
        return validationErrors;
    }

    private List<ValidationError> validateThatNoFieldsAreNullOrEmpty(CodelistRequest request) {
        FieldValidator nullOrEmpty = new FieldValidator(request.getReference());

        nullOrEmpty.checkBlank("listName", request.getList());
        nullOrEmpty.checkBlank("code", request.getCode());
        nullOrEmpty.checkBlank("description", request.getDescription());

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

    private List<ValidationError> validateRepositoryValues(CodelistRequest request) {
        List<ValidationError> validationErrors = new ArrayList<>();
        Optional<Codelist> existingCodelist = repository.findByListAndNormalizedCode(request.getListAsListName(), request.getNormalizedCode());

        if (creatingExistingElement(request.isUpdate(), existingCodelist.isPresent())) {
            validationErrors.add(new ValidationError(request.getReference(), "creatingExistingCodelist",
                    String.format("The codelist %s already exists and therefore cannot be created", request.getIdentifyingFields())));
        }
        if (updatingNonExistingElement(request.isUpdate(), existingCodelist.isPresent())) {
            validationErrors.add(new ValidationError(request.getReference(), "updatingNonExistingCodelist",
                    String.format("The codelist %s does not exist and therefore cannot be updated", request.getIdentifyingFields())));
        }
        return validationErrors;
    }
}