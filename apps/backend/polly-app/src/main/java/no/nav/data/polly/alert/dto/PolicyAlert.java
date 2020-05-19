package no.nav.data.polly.alert.dto;

import lombok.Value;

import java.util.Optional;
import java.util.UUID;

@Value
public class PolicyAlert {

    UUID policyId;
    UUID informationTypeId;
    boolean missingLegalBasis;
    boolean excessInfo;
    boolean missingArt6;
    boolean missingArt9;

    public Optional<PolicyAlert> resolve() {
        return missingLegalBasis || missingArt6 || missingArt9 ? Optional.of(this) : Optional.empty();
    }
}
