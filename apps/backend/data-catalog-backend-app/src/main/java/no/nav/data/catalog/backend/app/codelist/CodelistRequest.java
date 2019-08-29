package no.nav.data.catalog.backend.app.codelist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.validator.ValidationError;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodelistRequest {

    private String list;
    private String code;
    private String description;

    public Codelist convert() {
        return Codelist.builder()
                .list(ListName.valueOf(list))
                .code(code)
                .description(description)
                .build();
    }

    public String getIdentifyingFields() {
        return list + "-" + code;
    }

    public ListName getListAsListName() {
        return ListName.valueOf(list);
    }

    public List<ValidationError> validateThatNoFieldsAreNullOrEmpty(String reference) {
        final String ERROR_TYPE = "fieldIsNullOrMissing";
        String errorMessage = "The %s was null or missing";
        List<ValidationError> validationErrors = new ArrayList<>();

        if (list == null || list.isEmpty()) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE, String.format(errorMessage, "listName")));
        }
        if (code == null || code.isEmpty()) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE, String.format(errorMessage, "code")));
        }
        if (description == null || description.isEmpty()) {
            validationErrors.add(new ValidationError(reference, ERROR_TYPE, String.format(errorMessage, "description")));
        }
        return validationErrors;
    }

    public void toUpperCaseAndTrim() {
        setList(this.list.toUpperCase().trim());
        setCode(this.code.toUpperCase().trim());
        setDescription(this.description.trim());
    }
}
