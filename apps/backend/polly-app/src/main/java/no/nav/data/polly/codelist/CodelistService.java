package no.nav.data.polly.codelist;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

@Slf4j
@Service
public class CodelistService extends RequestValidator<CodelistRequest> {

    private CodelistRepository repository;

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
        List<Codelist> codelists = requests.stream()
                .map(CodelistRequest::convert)
                .collect(Collectors.toList());
        List<Codelist> saved = repository.saveAll(codelists);
        saved.forEach(CodelistCache::set);
        return saved;
    }

    public List<Codelist> update(List<CodelistRequest> requests) {
        List<Codelist> codelists = requests.stream()
                .map(this::updateDescriptionInRepository)
                .collect(Collectors.toList());

        List<Codelist> saved = repository.saveAll(codelists);
        saved.forEach(CodelistCache::set);
        return saved;
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

    public void validateRequest(List<CodelistRequest> requests) {
        List<ValidationError> validationErrors = validateRequestsAndReturnErrors(requests);

        if (!validationErrors.isEmpty()) {
            log.error("The request was not accepted. The following errors occurred during validation: {}", validationErrors);
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
        }
    }

    private List<ValidationError> validateRequestsAndReturnErrors(List<CodelistRequest> requests) {
        requests = StreamUtils.nullToEmptyList(requests);
        if (requests.isEmpty()) {
            return Collections.emptyList();
        }

        List<ValidationError> validationErrors = new ArrayList<>(validateNoDuplicates(requests));

        requests.forEach(request -> {
            request.toUpperCaseAndTrim();
            validationErrors.addAll(validateFields(request));

            if (request.getListAsListName() != null) {
                boolean existInRepository = repository.findByListAndNormalizedCode(request.getListAsListName(), Codelist.normalize(request.getCode())).isPresent();
                validationErrors.addAll(validateRepositoryValues(request, existInRepository));
            }
        });

        return validationErrors;
    }

}