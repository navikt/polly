package no.nav.data.polly.codelist.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.codeusage.CodeUsage;
import no.nav.data.polly.codelist.codeusage.UsedInInstance;
import org.codehaus.jackson.annotate.JsonPropertyOrder;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
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

    public List<UsedInInstance> getInformationTypes() {
        return codesInUse.stream().map(CodeUsage::getInformationTypes).flatMap(List::stream).collect(Collectors.toList());
    }

    public int getCountOfInformationTypes() {
        return getInformationTypes().size();
    }

    public List<UsedInInstance> getPolicies() {
        return codesInUse.stream().map(CodeUsage::getPolicies).flatMap(List::stream).collect(Collectors.toList());
    }

    public int getCountOfPolicies() {
        return getPolicies().size();
    }

    public List<UsedInInstance> getProcesses() {
        return codesInUse.stream().map(CodeUsage::getProcesses).flatMap(List::stream).collect(Collectors.toList());
    }

    public int getCountOfProcesses() {
        return getProcesses().size();
    }
}
