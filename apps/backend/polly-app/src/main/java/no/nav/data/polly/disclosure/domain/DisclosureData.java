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

    private String description;
    @NotNull
    private String recipient; // codelist THIRD_PARTY
    @NotNull
    private String recipientPurpose;
    @NotNull
    private LocalDate start;
    @NotNull
    private LocalDate end;
    private UUID documentId;

    @Valid
    private List<LegalBasis> legalBases = new ArrayList<>();

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class DisclosureDataBuilder {

        private List<LegalBasis> legalBases = new ArrayList<>();

        public DisclosureDataBuilder legalBasis(LegalBasis legalBasis) {
            legalBases.add(legalBasis);
            return this;
        }
    }
}
