package no.nav.data.polly.codelist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.dto.ProcessResponse;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonPropertyOrder;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"listName", "processResponses", "policyResponses", "informationTypeResponses"})
public class FindCodeUsageResponse {

    private ListName listName;
    private List<ProcessResponse> processResponses;
    private List<PolicyResponse> policyResponses;
    private List<InformationTypeResponse> informationTypeResponses;

    public FindCodeUsageResponse(ListName listName) {
        this.listName = listName;
    }

    @JsonIgnore
    public boolean isEmpty() {
        return processResponses.isEmpty() && policyResponses.isEmpty() && informationTypeResponses.isEmpty();
    }

    public String toString() {
        String lists = processResponses.toString() + policyResponses.toString() + informationTypeResponses.toString();
        return listName + " - " + lists;
    }
}
