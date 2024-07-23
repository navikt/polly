package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
public class CodelistRequest implements RequestElement {

    private String list;
    private String code;
    private String shortName;
    private String description;

    private boolean update;
    private int requestIndex;

    public Codelist convertToCodelist() {
        return Codelist.builder()
                .list(ListName.valueOf(list))
                .code(code)
                .shortName(shortName)
                .description(description)
                .build();
    }
    
    public static List<Codelist> convertToCodelists(List<CodelistRequest> requests) {
        return requests.stream()
            .map(CodelistRequest::convertToCodelist)
            .collect(Collectors.toList());
    }


    @JsonIgnore
    @Override
    public String getId() {
        return getIdentifyingFields();
    }

    @Override
    public String getIdentifyingFields() {
        return list + "-" + code;
    }

    @JsonIgnore
    public ListName getListAsListName() {
        try {
            return ListName.valueOf(list);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    @Override
    public void format() {
        setList(toUpperCaseAndTrim(list));
        setCode(toUpperCaseAndTrim(code));
        setShortName(StringUtils.trim(shortName));
        setDescription(StringUtils.trim(description));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkRequiredEnum(Fields.list, getList(), ListName.class);
        if (!update) {
            validator.checkIfCodelistIsOfImmutableType(getList());
        }
        validator.checkCodelistCode(Fields.code, getCode());
        validator.checkBlank(Fields.shortName, getShortName());
        validator.checkBlank(Fields.description, getDescription());
    }

}
