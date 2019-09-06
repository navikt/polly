package no.nav.data.catalog.backend.app.codelist;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.validator.RequestElement;

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

    String getReference() {
        return "Request:" + requestIndex;
    }

    @Override
    public String getIdentifyingFields() {
        return list + "-" + code;
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
        setCode(ifNotNullToUppercaseAndTrim(code));
        setDescription(ifNotNullTrim(description));
    }

    private String ifNotNullToUppercaseAndTrim(String field) {
        return field == null ? null : field.toUpperCase().trim();
    }

    private String ifNotNullTrim(String field) {
        return field == null ? null : field.trim();
    }
}
