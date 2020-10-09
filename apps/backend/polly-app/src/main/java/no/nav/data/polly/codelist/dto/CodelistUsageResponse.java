package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.domain.ListName;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"listName", "codesInUse"})
public class CodelistUsageResponse {

    private ListName listName;
    private List<CodeUsageResponse> codesInUse;

}
