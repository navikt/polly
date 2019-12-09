package no.nav.data.polly.codelist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.dto.ProcessResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FindCodeUsageResponse {

    private List<ProcessResponse> processResponses;
    private List<PolicyResponse> policyResponses;
    private List<InformationTypeResponse> informationTypeResponses;

    public boolean isEmpty(){
        return processResponses.isEmpty() && policyResponses.isEmpty() && informationTypeResponses.isEmpty();
    }
}
