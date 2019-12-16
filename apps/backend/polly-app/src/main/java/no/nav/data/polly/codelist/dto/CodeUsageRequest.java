package no.nav.data.polly.codelist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodeUsageRequest {

    private String listName;
    private String code;

    public ListName getAsListName() {
        return ListName.valueOf(listName);
    }
}
