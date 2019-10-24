package no.nav.data.polly.policy.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.entities.Policy;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class PolicyRequest {

    private String id;
    private String legalBasisDescription;
    private String purposeCode;
    private String informationTypeName;
    private String start;
    private String end;

    @JsonIgnore
    private int requestId;
    @JsonIgnore
    private boolean isUpdate;
    @JsonIgnore
    private InformationType informationType;
    @JsonIgnore
    private Policy existingPolicy;

    @JsonIgnore
    public String getReference() {
        return getInformationTypeName() + "/" + getPurposeCode();
    }

    public static void initialize(List<PolicyRequest> requests, boolean isUpdate) {
        AtomicInteger i = new AtomicInteger(1);
        requests.forEach(req -> {
            req.setUpdate(isUpdate);
            req.setRequestId(i.getAndIncrement());
        });
    }
}
