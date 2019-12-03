package no.nav.data.polly.search.dto;

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
@FieldNameConstants
public class FindCodeUsageRequest {

    private String listName;
    private String code;

    public ListName getAsListName() {
        return ListName.valueOf(listName);
    }
}
