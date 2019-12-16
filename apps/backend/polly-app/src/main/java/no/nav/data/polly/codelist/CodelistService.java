package no.nav.data.polly.codelist;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.codeusage.CodeUsageService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageRequest;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.exceptions.CodelistNotErasableException;
import no.nav.data.polly.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
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
    private CodeUsageService codeUsageService;

    // @Lazy to avoid circular dependancy
    public CodelistService(CodelistRepository codelistRepository, @Lazy CodeUsageService codeUsageService) {
        this.codelistRepository = codelistRepository;
        this.codeUsageService = codeUsageService;
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

    @Scheduled(initialDelayString = "PT10M", fixedRateString = "PT10M")
    @PostConstruct
    public void refreshCache() {
        List<Codelist> allCodelists = codelistRepository.findAll();
        CodelistCache.init(cache -> allCodelists.forEach(cache::setCode));
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
        if (toDelete.isEmpty()) {
            log.error("Cannot find a codelist to delete with code={} and listName={}", code, name);
            throw new CodelistNotFoundException(
                    String.format("Cannot find a codelist to delete with code=%s and listName=%s", code, name));
        }
        validateNonImmutableTypeOfCodelist(name);
        validateCodelistIsNotInUse(name, code);
        codelistRepository.delete(toDelete.get());
        CodelistCache.remove(name, code);
    }

    private void validateCodelistIsNotInUse(ListName name, String code) {
        CodeUsageResponse codeUsage = codeUsageService.findCodeUsage(name.toString(), code);
        if (codeUsage.codelistIsInUse(code)) {
            log.error("The code {} in list {} cannot be erased. {}", code, name, codeUsage.toString());
            throw new CodelistNotErasableException(String.format("The code %s in list %s cannot be erased. %s", code, name, codeUsage.toString()));
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

    public void validateCodeUsageRequests(List<CodeUsageRequest> requests) {
        FieldValidator validator = new FieldValidator(REFERENCE);
        StreamUtils.safeStream(requests).forEach(request -> checkValidCode(request.getListName(), request.getCode(), validator));
        ifErrorsThrowCodelistNotFoundException(validator.getErrors());
    }

    private void checkValidListName(String listName, FieldValidator validator) {
        validator.checkRequiredEnum(FIELD_NAME_LIST, listName, ListName.class);
    }

    public void checkValidCode(String listName, String code, FieldValidator validator) {
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