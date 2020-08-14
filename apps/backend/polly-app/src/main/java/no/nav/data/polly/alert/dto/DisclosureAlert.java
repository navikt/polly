package no.nav.data.polly.alert.dto;

import lombok.Value;

import java.util.Optional;
import java.util.UUID;

@Value
public class DisclosureAlert {

    UUID disclosureId;
    boolean missingArt6;

    public Optional<DisclosureAlert> resolve() {
        return !missingArt6 ? Optional.empty() : Optional.of(this);
    }
}
