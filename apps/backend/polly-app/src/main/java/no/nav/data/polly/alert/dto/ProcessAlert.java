package no.nav.data.polly.alert.dto;

import lombok.Value;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Value
public class ProcessAlert {

    UUID processId;
    boolean usesAllInformationTypes;
    List<PolicyAlert> policies;

    public Optional<ProcessAlert> resolve() {
        return policies.isEmpty() ? Optional.empty() : Optional.of(this);
    }
}
