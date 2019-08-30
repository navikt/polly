package no.nav.data.catalog.backend.app.codelist;

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
        setList(this.list.toUpperCase().trim());
        setCode(this.code.toUpperCase().trim());
        setDescription(this.description.trim());
    }
}
