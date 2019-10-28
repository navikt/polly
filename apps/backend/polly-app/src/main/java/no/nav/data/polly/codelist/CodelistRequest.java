package no.nav.data.polly.codelist;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
    String getNormalizedCode() {
        return Codelist.normalize(code);
    }

    ListName getListAsListName() {
        return ListName.valueOf(list);
    }

    void toUpperCaseAndTrim() {
        setList(ifNotNullToUppercaseAndTrim(list));
        setCode(StringUtils.trim(code));
        setDescription(StringUtils.trim(description));
    }

    static void initiateRequests(List<CodelistRequest> codelistRequests, boolean update) {
        AtomicInteger requestIndex = new AtomicInteger(1);
        codelistRequests.forEach(request -> {
            request.setUpdate(update);
            request.setRequestIndex(requestIndex.getAndIncrement());
        });
    }

    @Override
    public FieldValidator validateFields() {
        FieldValidator validator = new FieldValidator(getReference());

        validator.checkBlank("listName", getList());
        validator.checkBlank("code", getCode());
        validator.checkBlank("description", getDescription());

        return validator;
    }

}
