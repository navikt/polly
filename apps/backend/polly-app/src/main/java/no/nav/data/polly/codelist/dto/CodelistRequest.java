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

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

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

    @JsonIgnore
    private boolean update;
    @JsonIgnore
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return list + "-" + getNormalizedCode();
    }

    @JsonIgnore
    public String getNormalizedCode() {
        return Codelist.normalize(code);
    }

    public ListName getListAsListName() {
        try {
            return ListName.valueOf(list);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public void toUpperCaseAndTrim() {
        setList(ifNotNullToUppercaseAndTrim(list));
        setCode(StringUtils.trim(code));
        setDescription(StringUtils.trim(description));
    }

    public static void initiateRequests(List<CodelistRequest> codelistRequests, boolean update) {
        AtomicInteger requestIndex = new AtomicInteger(1);
        codelistRequests.forEach(request -> {
            request.setUpdate(update);
            request.setRequestIndex(requestIndex.getAndIncrement());
        });
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkEnum(Fields.list, getList(), ListName.class);
        validator.checkBlank(Fields.code, getCode());
        validator.checkBlank(Fields.description, getDescription());
    }

}
