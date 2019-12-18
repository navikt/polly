package no.nav.data.polly.codelist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.codeusage.CodeUsageResponse;
import org.codehaus.jackson.annotate.JsonPropertyOrder;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"listName", "codesInUse"})
public class CodelistUsageResponse {

    private String listName;
    private List<CodeUsageResponse> codesInUse;

    public CodelistUsageResponse(CodeUsageResponse codeUsage) {
        this.listName = codeUsage.getListName();
        this.codesInUse = new ArrayList<>();
        addCodeUsage(codeUsage);
    }

    public void addCodeUsage(CodeUsageResponse codeUsage) {
        codesInUse.add(codeUsage);
    }
}
