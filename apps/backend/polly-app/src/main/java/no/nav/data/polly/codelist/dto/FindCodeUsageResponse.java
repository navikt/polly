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
    private String code;
    private List<ProcessResponse> processResponses;
    private List<PolicyResponse> policyResponses;
    private List<InformationTypeResponse> informationTypeResponses;

    public FindCodeUsageResponse(ListName listName, String code) {
        this.listName = listName;
        this.code = code;
    }

    @JsonIgnore
    public boolean codelistIsInUse() {
        return hasResponse(processResponses) || hasResponse(policyResponses) || hasResponse(informationTypeResponses);
    }

    @JsonIgnore
    private boolean hasResponse(List list) {
        return list != null && !list.isEmpty();
    }

    public String toString() {
        return String.format("%s in %s is used in: {%s}", code, listName, getResponses());
    }

    private String getResponses() {
        String s = "";
        if (hasResponse(processResponses)) {
            s += String.format("Processes: {%s}", processResponses.toString());
        }
        if (hasResponse(policyResponses)) {
            s += String.format("Policies: {%s}", policyResponses.toString());
        }
        if (hasResponse(informationTypeResponses)) {
            s += String.format("InformationTypes: {%s}", informationTypeResponses.toString());
        }

        return s;
    }
}
