package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import org.apache.commons.lang3.StringUtils;

import static no.nav.data.polly.common.utils.StringUtils.ifNotNullToUppercaseAndTrim;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
public class CodelistRequest implements RequestElement {

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

    private boolean update;
    private int requestIndex;

    @JsonIgnore
    @Override
    public String getId() {
        return getIdentifyingFields();
    }

    @Override
    public String getIdentifyingFields() {
        return list + "-" + getNormalizedCode();
    }

    @JsonIgnore
    public String getNormalizedCode() {
        return Codelist.normalize(code);
    }

    @JsonIgnore
    public ListName getListAsListName() {
        try {
            return ListName.valueOf(list);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public void format() {
        setList(ifNotNullToUppercaseAndTrim(list));
        setCode(StringUtils.trim(code));
        setDescription(StringUtils.trim(description));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkRequiredEnum(Fields.list, getList(), ListName.class);
        validator.checkBlank(Fields.code, getCode());
        validator.checkBlank(Fields.description, getDescription());
    }

}
