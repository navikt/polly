package no.nav.data.polly.codelist;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Slf4j
@Service
public class CodelistService extends RequestValidator<CodelistRequest> {

    private static final String FIELD_NAME_LIST = "list";
    private static final String FIELD_NAME_CODE = "code";
    private static final String REFERENCE = "Validate Codelist";
    private CodelistRepository codelistRepository;

    public CodelistService(CodelistRepository codelistRepository) {
        this.codelistRepository = codelistRepository;
    }

    public static Codelist getCodelist(ListName listName, String code) {
        return CodelistCache.getCodelist(listName, code);
    }

    public static CodelistResponse getCodelistResponse(ListName listName, String code) {
        if (code == null) {
            return null;
        }
        Codelist codelist = getCodelist(listName, code);
        if (codelist == null) {
            return new CodelistResponse(listName, code, null, null);
        }
        return codelist.convertToResponse();
    }

    public static List<CodelistResponse> getCodelistResponseList(ListName listName) {
        return convert(CodelistCache.getCodelist(listName), Codelist::convertToResponse);
    }

    public static List<CodelistResponse> getCodelistResponseList(ListName listName, Collection<String> codes) {
        return convert(codes, code -> getCodelistResponse(listName, code));
    }

    public static List<Codelist> getCodelist(ListName name) {
        return CodelistCache.getCodelist(name);
    }

    public static List<Codelist> getAll() {
        return CodelistCache.getAll();
    }

    @PostConstruct
    public void refreshCache() {
        List<Codelist> allCodelists = codelistRepository.findAll();
        CodelistCache.init();
        allCodelists.forEach(CodelistCache::set);
    }

    public List<Codelist> save(List<CodelistRequest> requests) {
        List<Codelist> codelists = requests.stream()
                .map(CodelistRequest::convert)
                .collect(Collectors.toList());
        List<Codelist> saved = codelistRepository.saveAll(codelists);
        saved.forEach(CodelistCache::set);
        return saved;
    }

    public List<Codelist> update(List<CodelistRequest> requests) {
        List<Codelist> codelists = requests.stream()
                .map(this::updateDescriptionInRepository)
                .collect(Collectors.toList());

        List<Codelist> saved = codelistRepository.saveAll(codelists);
        saved.forEach(CodelistCache::set);
        return saved;
    }

    private Codelist updateDescriptionInRepository(CodelistRequest request) {
        Codelist codelist = codelistRepository.findByListAndCode(request.getListAsListName(), request.getCode()).get(); // All request are validated at this point
        codelist.setShortName(request.getShortName());
        codelist.setDescription(request.getDescription());
        return codelist;

    }

    public void delete(ListName name, String code) {
        Optional<Codelist> toDelete = codelistRepository.findByListAndCode(name, code);
        if (toDelete.isPresent()) {
            validateNonImmutableTypeOfCodelist(name);
            codelistRepository.delete(toDelete.get());
            CodelistCache.remove(name, code);
        } else {
            log.error("Cannot find a codelist to delete with code={} and listName={}", code, name);
            throw new CodelistNotFoundException(
                    String.format("Cannot find a codelist to delete with code=%s and listName=%s", code, name));
        }
    }

    public void validateNonImmutableTypeOfCodelist(ListName listName) {
        FieldValidator validator = new FieldValidator(REFERENCE);
        validator.checkIfCodelistIsOfImmutableType(listName);
        ifErrorsThrowCodelistNotFoundException(validator.getErrors());
    }

    public void validateListName(String listName) {
        FieldValidator validator = new FieldValidator(REFERENCE);
        validator.checkRequiredEnum(FIELD_NAME_LIST, listName, ListName.class);
        ifErrorsThrowCodelistNotFoundException(validator.getErrors());
    }

    public void validateListNameAndCode(String listName, String code) {
        FieldValidator validator = new FieldValidator(REFERENCE);
        checkValidCode(listName, code, validator);
        ifErrorsThrowCodelistNotFoundException(validator.getErrors());
    }

    private void checkValidListName(String listName, FieldValidator validator) {
        validator.checkRequiredEnum(FIELD_NAME_LIST, listName, ListName.class);
    }

    private void checkValidCode(String listName, String code, FieldValidator validator) {
        checkValidListName(listName, validator);
        validator.checkRequiredCodelist(FIELD_NAME_CODE, code, ListName.valueOf(listName));
    }

    public void validateRequest(List<CodelistRequest> requests, boolean update) {
        initialize(requests, update);

        requests.forEach(CodelistRequest::format);
        var validationErrors = validateNoDuplicates(requests);

        validationErrors.addAll(StreamUtils.applyAll(requests,
                RequestElement::validateFields,
                req -> validateRepositoryValues(req, codelistRepository.findByListAndCode(req.getListAsListName(), req.getCode()).isPresent())
        ));

        ifErrorsThrowValidationException(validationErrors);
    }

}