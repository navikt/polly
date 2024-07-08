package no.nav.data.common.validator;

import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

import static no.nav.data.common.utils.StreamUtils.safeStream;

public class FieldValidator {

    private static final String ERROR_TYPE_MISSING = "fieldIsNullOrMissing";
    private static final String ERROR_TYPE_PATTERN = "fieldWrongFormat";
    private static final String ERROR_TYPE_ENUM = "fieldIsInvalidEnum";
    private static final String ERROR_TYPE_CODELIST = "fieldIsInvalidCodelist";
    private static final String ERROR_TYPE_CODELIST_CODE = "fieldIsInvalidCodelistCode";
    private static final String ERROR_TYPE_DATE = "fieldIsInvalidDate";
    private static final String ERROR_TYPE_UUID = "fieldIsInvalidUUID";
    private static final String ERROR_MESSAGE_MISSING = "%s was null or missing";
    private static final String ERROR_MESSAGE_PATTERN = "%s is not valid for pattern '%s'";
    private static final String ERROR_MESSAGE_ENUM = "%s: %s was invalid for type %s";
    private static final String ERROR_MESSAGE_CODELIST = "%s: %s code not found in codelist %s";
    private static final String ERROR_MESSAGE_CODELIST_CODE = "%s: %s code has invalid format (alphanumeric and underscore)";
    private static final String ERROR_MESSAGE_DATE = "%s: %s date is not a valid format";
    private static final String ERROR_MESSAGE_UUID = "%s: %s uuid is not a valid format";
    private static final String ERROR_TYPE_IMMUTABLE_CODELIST = "codelistIsOfImmutableType";
    private static final String ERROR_MESSAGE_IMMUTABLE_CODELIST = "%s is an immutable type of codelist. For amendments, please contact team #dataplatform";

    private static final Pattern CODE_PATTERN = Pattern.compile("^[A-Z0-9_]+$");

    private final List<ValidationError> validationErrors = new ArrayList<>();
    private final String reference;
    private final String parentField;

    public FieldValidator(String reference) {
        this.reference = reference;
        this.parentField = "";
    }

    public FieldValidator(String reference, String parentField) {
        this.reference = reference;
        this.parentField = StringUtils.appendIfMissing(parentField, ".");
    }

    public boolean checkBlank(String fieldName, String fieldValue) {
        if (StringUtils.isBlank(fieldValue)) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_MISSING, String.format(ERROR_MESSAGE_MISSING, getFieldName(fieldName))));
            return true;
        }
        return false;
    }

    public void checkNull(String fieldName, Object fieldValue) {
        if (fieldValue == null) {
            validationErrors.add(new ValidationError(getFieldName(fieldName), ERROR_TYPE_MISSING, ERROR_MESSAGE_MISSING));
        }
    }

    public void checkCodelistCode(String fieldName, String fieldValue) {
        if (checkBlank(fieldName, fieldValue)) {
            return;
        }
        if (!CODE_PATTERN.matcher(fieldValue).matches()) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_CODELIST_CODE, String.format(ERROR_MESSAGE_CODELIST_CODE, getFieldName(fieldName), fieldValue)));
        }
    }

    public <T extends Enum<T>> void checkRequiredEnum(String fieldName, Enum<T> fieldValue) {
        if (fieldValue == null) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_MISSING, String.format(ERROR_MESSAGE_MISSING, getFieldName(fieldName))));
        }
    }

    public <T extends Enum<T>> void checkRequiredEnum(String fieldName, String fieldValue, Class<T> type) {
        if (checkBlank(fieldName, fieldValue)) {
            return;
        }
        checkEnum(fieldName, fieldValue, type);
    }

    public <T extends Enum<T>> void checkEnum(String fieldName, String fieldValue, Class<T> type) {
        try {
            Enum.valueOf(type, fieldValue);
        } catch (IllegalArgumentException e) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_ENUM, String.format(ERROR_MESSAGE_ENUM, getFieldName(fieldName), fieldValue, type.getSimpleName())));
        }
    }

    public <T extends Enum<T>> void addError(String fieldName, String fieldValue, String errorType, String message) {
        validationErrors.add(new ValidationError(reference, errorType, "%s: %s %s".formatted(getFieldName(fieldName), fieldValue, message)));
    }

    public void checkPattern(String fieldName, String value, Pattern pattern) {
        if (StringUtils.isBlank(value)) {
            return;
        }
        if (!pattern.matcher(value).matches()) {
            validationErrors.add(new ValidationError(getFieldName(fieldName), ERROR_TYPE_PATTERN, String.format(ERROR_MESSAGE_PATTERN, value, pattern.toString())));
        }
    }

    public <T extends Enum<T>> void checkIfCodelistIsOfImmutableType(String list) {
        if (EnumUtils.isValidEnum(ListName.class, list)) {
            checkIfCodelistIsOfImmutableType(ListName.valueOf(list));
        }
    }

    public void checkIfCodelistIsOfImmutableType(ListName listName) {
        if (listName.equals(ListName.GDPR_ARTICLE) || listName.equals(ListName.SENSITIVITY)) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_IMMUTABLE_CODELIST, String.format(ERROR_MESSAGE_IMMUTABLE_CODELIST, listName)));
        }
    }

    public void checkRequiredCodelist(String fieldName, String fieldValue, ListName listName) {
        if (checkBlank(fieldName, fieldValue)) {
            return;
        }
        checkCode(fieldName, fieldValue, listName);
    }

    public void checkCodelist(String fieldName, String fieldValue, ListName listName) {
        if (fieldValue == null) {
            return;
        }
        checkCode(fieldName, fieldValue, listName);
    }

    private void checkCode(String fieldName, String fieldValue, ListName listName) {
        if (CodelistStaticService.getCodelist(listName, fieldValue) == null) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_CODELIST, String.format(ERROR_MESSAGE_CODELIST, getFieldName(fieldName), fieldValue, listName)));
        }
    }

    public void checkCodelists(String fieldName, Collection<String> values, ListName listName) {
        AtomicInteger i = new AtomicInteger(0);
        safeStream(values).forEach(value -> checkRequiredCodelist(String.format("%s[%d]", fieldName, i.getAndIncrement()), value, listName));
    }

    public void checkRequiredCodelists(String fieldName, Collection<String> values, ListName listName) {
        checkCodelists(fieldName, values, listName);
        if (CollectionUtils.isEmpty(values)) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_MISSING, String.format(ERROR_MESSAGE_MISSING, getFieldName(fieldName))));
        }
    }

    public void checkDate(String fieldName, String fieldValue) {
        if (StringUtils.isBlank(fieldValue)) {
            return;
        }
        try {
            LocalDate.parse(fieldValue);
        } catch (DateTimeParseException e) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_DATE, String.format(ERROR_MESSAGE_DATE, getFieldName(fieldName), fieldValue)));
        }
    }

    public void checkUUID(String fieldName, String fieldValue) {
        if (StringUtils.isBlank(fieldValue)) {
            return;
        }
        try {
            //noinspection ResultOfMethodCallIgnored
            UUID.fromString(fieldValue);
        } catch (Exception e) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE_UUID, String.format(ERROR_MESSAGE_UUID, getFieldName(fieldName), fieldValue)));
        }
    }

    public void checkId(RequestElement request) {
        boolean nullId = request.getId() == null;
        boolean update = request.isUpdate();
        if (update && nullId) {
            validationErrors.add(new ValidationError(request.getReference(), "missingIdForUpdate", String.format("%s is missing ID for update", request.getIdentifyingFields())));
        } else if (!update && !nullId) {
            validationErrors.add(new ValidationError(request.getReference(), "idForCreate", String.format("%s has ID for create", request.getIdentifyingFields())));
        }
    }

    private String getFieldName(String fieldName) {
        return parentField + fieldName;
    }

    public void validateType(String fieldName, Collection<? extends Validated> fieldValues) {
        AtomicInteger i = new AtomicInteger(0);
        safeStream(fieldValues).forEach(fieldValue -> {
            validateType(String.format("%s[%d]", fieldName, i.getAndIncrement()), fieldValue);
        });
    }

    public void validateType(String fieldName, Validated fieldValue) {
        FieldValidator fieldValidator = new FieldValidator(reference, fieldName);
        fieldValue.format();
        fieldValue.validate(fieldValidator);
        validationErrors.addAll(fieldValidator.getErrors());
    }

    public List<ValidationError> getErrors() {
        return validationErrors;
    }

    public void ifErrorsThrowValidationException() {
        RequestValidator.ifErrorsThrowValidationException(validationErrors);
    }

}