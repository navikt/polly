package no.nav.data.polly.codelist.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.codeusage.CodeUsage;
import org.codehaus.jackson.annotate.JsonPropertyOrder;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"listName", "codesInUse"})
public class CodeUsageResponse {

    private String listName;
    private List<CodeUsage> codesInUse;

    public CodeUsageResponse(CodeUsage codeUsage) {
        this.listName = codeUsage.getListName();
        this.codesInUse = new ArrayList<>();
        addCodeUsage(codeUsage);
    }

    public void addCodeUsage(CodeUsage codeUsage) {
        codesInUse.add(codeUsage);
    }
}
