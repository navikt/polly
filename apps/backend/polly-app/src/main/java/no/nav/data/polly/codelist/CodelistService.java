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
        Optional<Codelist> optionalCodelist = codelistRepository.findByListAndCode(request.getListAsListName(), request.getCode());
        if (optionalCodelist.isPresent()) {
            Codelist codelist = optionalCodelist.get();
            codelist.setShortName(request.getShortName());
            codelist.setDescription(request.getDescription());
            return codelist;
        }
        //TODO: These should never be reached since list of request has been validated. Ok to remove?
        log.error("Cannot find codelist with code={} in list={}", request.getCode(), request.getList());
        throw new CodelistNotFoundException(String.format(
                "Cannot find codelist with code=%s in list=%s", request.getCode(), request.getList()));
    }

    public void delete(ListName name, String code) {
        Optional<Codelist> toDelete = codelistRepository.findByListAndCode(name, code);
        if (toDelete.isPresent()) {
            codelistRepository.delete(toDelete.get());
            CodelistCache.remove(name, code);
        } else {
            log.error("Cannot find a codelist to delete with code={} and listName={}", code, name);
            throw new IllegalArgumentException(
                    String.format("Cannot find a codelist to delete with code=%s and listName=%s", code, name));
        }
    }

    public void validateListNameExists(String listName) {
        FieldValidator validator = new FieldValidator("listName");
        validator.throwCodelistNotFoundExceptionIfEnumError(FIELD_NAME_LIST, listName, ListName.class);
    }

    public void validateListNameAndCodeExists(String listName, String code) {
        validateListNameExists(listName);
        FieldValidator validator = new FieldValidator("code");
        validator.throwCodelistNotFoundExceptionIfCodeError(FIELD_NAME_CODE, code, ListName.valueOf(listName));
    }

    public void validateListNameAndCodeExistsAndNotImmutable(String listName, String code) {
        validateListNameAndCodeExists(listName, code);
        FieldValidator validator = new FieldValidator("immutable codelist");
        validator.throwValidationExceptionIfImmutableCodelistError(listName);
    }

    public void validateRequest(List<CodelistRequest> requests, boolean update) {
        initialize(requests, update);

        requests.forEach(CodelistRequest::format);
        var validationErrors = validateNoDuplicates(requests);

        validationErrors.addAll(StreamUtils.applyAll(requests,
                RequestElement::validateFields,
                req -> validateRepositoryValues(req, codelistRepository.findByListAndCode(req.getListAsListName(), req.getCode()).isPresent())
        ));

        checkForErrors(validationErrors);
    }

}