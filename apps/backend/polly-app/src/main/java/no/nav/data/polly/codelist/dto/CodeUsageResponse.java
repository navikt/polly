package no.nav.data.polly.codelist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.codeusage.UsedInInstance;
import no.nav.data.polly.codelist.domain.ListName;
import org.codehaus.jackson.annotate.JsonPropertyOrder;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"code", "informationTypes", "policies", "processes", "disclosures", "documents"})
public class CodeUsageResponse {

    private ListName listName;
    private String code;
    private List<UsedInInstance> informationTypes;
    private List<UsedInInstance> policies;
    private List<UsedInInstance> processes;
    private List<UsedInInstance> disclosures;
    private List<UsedInInstance> documents;

    public CodeUsageResponse(ListName listName, String code) {
        this.listName = listName;
        this.code = code;
        this.informationTypes = new ArrayList<>();
        this.policies = new ArrayList<>();
        this.processes = new ArrayList<>();
        this.disclosures = new ArrayList<>();
        this.documents = new ArrayList<>();
    }

    public boolean isInUse() {
        return !informationTypes.isEmpty() || !policies.isEmpty() || !processes.isEmpty() || !disclosures.isEmpty() || !documents.isEmpty();
    }
}
