package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;

import static no.nav.data.polly.common.utils.StringUtils.toUpperCaseAndTrim;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
public class ReplaceCodelistRequest {

    private String list;
    private String oldCode;
    private String newCode;

    @JsonIgnore
    public ListName getListAsListName() {
        try {
            return ListName.valueOf(list);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public void formatAndValidate() {
        format();
        FieldValidator validator = new FieldValidator(String.format("%s-%s-%s", list, oldCode, newCode));
        validator.checkRequiredEnum(Fields.list, getList(), ListName.class);
        ListName listName = getListAsListName();
        if (listName != null) {
            validator.checkRequiredCodelist(Fields.oldCode, getOldCode(), listName);
            validator.checkRequiredCodelist(Fields.newCode, getNewCode(), listName);
        }
        validator.ifErrorsThrowValidationException();
    }

    private void format() {
        setList(toUpperCaseAndTrim(list));
        setOldCode(toUpperCaseAndTrim(oldCode));
        setNewCode(toUpperCaseAndTrim(newCode));
    }
}
