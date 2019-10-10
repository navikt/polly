package no.nav.data.catalog.backend.app.codelist;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.validator.FieldValidator;
import no.nav.data.catalog.backend.app.common.validator.RequestElement;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static no.nav.data.catalog.backend.app.common.utils.StringUtils.ifNotNullToUppercaseAndTrim;
import static no.nav.data.catalog.backend.app.common.utils.StringUtils.ifNotNullTrim;

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
    public String getReference() {
        return "Request:" + requestIndex;
    }

    @Override
    public String getIdentifyingFields() {
        return list + "-" + getNormalizedCode();
    }

    @JsonIgnore
    String getNormalizedCode() {
        return Codelist.normalize(code);
    }

    @Override
    public String getRequestType() {
        return "codelist";
    }

    ListName getListAsListName() {
        return ListName.valueOf(list);
    }

    void toUpperCaseAndTrim() {
        setList(ifNotNullToUppercaseAndTrim(list));
        setCode(ifNotNullTrim(code));
        setDescription(ifNotNullTrim(description));
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
