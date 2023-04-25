package no.nav.data.polly.disclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.legalbasis.domain.LegalBasis;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DisclosureData {

    private String name;
    private String description;
    @NotNull
    private String recipient; // codelist THIRD_PARTY
    private String recipientPurpose;
    @NotNull
    private LocalDate start;
    private String agreementReference;
    @NotNull
    private LocalDate end;
    private UUID documentId;
    private List<UUID> processIds;
    private List<UUID> informationTypeIds;

    @Valid
    private List<LegalBasis> legalBases = new ArrayList<>();
    private DisclosureAbroad abroad;
    private Boolean thirdCountryReceiver;

    public DisclosureAbroad getAbroad() {
        return abroad == null ? new DisclosureAbroad() : abroad;
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class DisclosureDataBuilder {

        private List<LegalBasis> legalBases = new ArrayList<>();

        public DisclosureDataBuilder legalBasis(LegalBasis legalBasis) {
            legalBases.add(legalBasis);
            return this;
        }
    }
}
