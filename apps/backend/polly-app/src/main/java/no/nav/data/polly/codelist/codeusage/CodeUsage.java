package no.nav.data.polly.codelist.codeusage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.annotate.JsonPropertyOrder;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"code", "informationTypes", "policies", "processes"})
public class CodeUsage {

    private String listName;
    private String code;
    private List<UsedInInstance> informationTypes;
    private List<UsedInInstance> policies;
    private List<UsedInInstance> processes;

    public CodeUsage(String listName, String code) {
        this.listName = listName;
        this.code = code;
        this.informationTypes = new ArrayList<>();
        this.policies = new ArrayList<>();
        this.processes = new ArrayList<>();
    }

    public boolean isNotInUse() {
        return informationTypes.isEmpty() && policies.isEmpty() && processes.isEmpty();
    }
}
