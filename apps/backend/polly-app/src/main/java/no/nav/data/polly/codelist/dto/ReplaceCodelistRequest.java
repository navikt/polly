package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.RequestValidator;
import no.nav.data.common.validator.Validated;
import no.nav.data.polly.codelist.domain.ListName;

import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
public class ReplaceCodelistRequest implements Validated {

    private String list;
    private String oldCode;
    private String newCode;
    private String newCodeName;

    @JsonIgnore
    public ListName getListAsListName() {
        try {
            return ListName.valueOf(list);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkRequiredEnum(Fields.list, getList(), ListName.class);
        ListName listName = getListAsListName();
        if (listName != null && !listName.equals(ListName.DEPARTMENT)) {
            validator.checkRequiredCodelist(Fields.oldCode, getOldCode(), listName);
            validator.checkRequiredCodelist(Fields.newCode, getNewCode(), listName);
        }
    }

    public void formatAndValidate() {
        format();
        RequestValidator.validate(String.format("%s-%s-%s", list, oldCode, newCode), this);
    }

    @Override
    public void format() {
        setList(toUpperCaseAndTrim(list));
        setOldCode(toUpperCaseAndTrim(oldCode));
        setNewCode(list.equals(ListName.DEPARTMENT.name()) ? newCode : toUpperCaseAndTrim(newCode));
        setNewCodeName(newCodeName);
    }

}
