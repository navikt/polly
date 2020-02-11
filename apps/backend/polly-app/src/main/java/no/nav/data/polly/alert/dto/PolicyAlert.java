package no.nav.data.polly.alert.dto;

import lombok.Value;

import java.util.Optional;
import java.util.UUID;

@Value
public class PolicyAlert {

    private UUID policyId;
    private boolean missingLegalBasis;
    private boolean missingArt6;
    private boolean missingArt9;

    public Optional<PolicyAlert> resolve() {
        return missingLegalBasis || missingArt6 || missingArt9 ? Optional.of(this) : Optional.empty();
    }
}
