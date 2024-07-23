package no.nav.data.polly.codelist.dto;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.CodelistNotErasableException;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.polly.codelist.CodelistRepository;
import no.nav.data.polly.codelist.codeusage.CodeUsageService;
import no.nav.data.polly.codelist.domain.ListName;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class CodelistRequestValidator extends RequestValidator<CodelistRequest> {
    
    private static final String FIELD_NAME_LIST = "list";
    private static final String FIELD_NAME_CODE = "code";
    private static final String REFERENCE = "Validate Codelist";

    private final CodeUsageService codeUsageService;
    private final CodelistRepository codelistRepository;

    public CodelistRequestValidator(@Lazy CodeUsageService codeUsageService, CodelistRepository codelistRepository) {
        this.codeUsageService = codeUsageService;
        this.codelistRepository = codelistRepository;
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

    public void validateCodelistIsNotInUse(ListName name, String code) {
        CodeUsageResponse codeUsage = codeUsageService.findCodeUsage(name, code);
        if (codeUsage.isInUse()) {
            log.warn("The code {} in list {} cannot be erased. {}", code, name, codeUsage.toString());
            throw new CodelistNotErasableException(String.format("The code %s in list %s cannot be erased. %s", code, name, codeUsage.toString()));
        }
    }

    private void checkValidListName(String listName, FieldValidator validator) {
        validator.checkRequiredEnum(FIELD_NAME_LIST, listName, ListName.class);
    }

    public void checkValidCode(String listName, String code, FieldValidator validator) {
        checkValidListName(listName, validator);
        validator.checkRequiredCodelist(FIELD_NAME_CODE, code, ListName.valueOf(listName));
    }

}