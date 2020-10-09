package no.nav.data.polly.codelist.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.process.dpprocess.dto.DpProcessShortResponse;
import no.nav.data.polly.process.dto.ProcessShortResponse;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"code", "informationTypes", "policies", "processes", "dpProcesses", "disclosures", "documents"})
public class CodeUsageResponse {

    private ListName listName;
    private String code;
    private List<UsedInInstance> informationTypes = new ArrayList<>();
    private List<UsedInInstancePurpose> policies = new ArrayList<>();
    private List<ProcessShortResponse> processes = new ArrayList<>();
    private List<DpProcessShortResponse> dpProcesses = new ArrayList<>();
    private List<UsedInInstance> disclosures = new ArrayList<>();
    private List<UsedInInstance> documents = new ArrayList<>();

    public CodeUsageResponse(ListName listName, String code) {
        this.listName = listName;
        this.code = code;
    }

    public boolean isInUse() {
        return !informationTypes.isEmpty() || !policies.isEmpty() || !processes.isEmpty() || !dpProcesses.isEmpty() || !disclosures.isEmpty() || !documents.isEmpty();
    }
}
