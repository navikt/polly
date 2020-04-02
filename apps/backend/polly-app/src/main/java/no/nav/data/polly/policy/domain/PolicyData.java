package no.nav.data.polly.policy.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.Period;
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
public class PolicyData {

    @NotNull
    private List<String> subjectCategories;
    @NotNull
    private LocalDate start;
    @NotNull
    private LocalDate end;
    private boolean legalBasesInherited = false;
    @Valid
    @NotNull
    private List<LegalBasis> legalBases = new ArrayList<>();
    private List<UUID> documentIds;

    public Period toPeriod() {
        return new Period(start, end);
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class PolicyDataBuilder {

        private List<LegalBasis> legalBases = new ArrayList<>();
        private List<UUID> documentIds = new ArrayList<>();

        public PolicyDataBuilder legalBasis(LegalBasis legalBasis) {
            legalBases.add(legalBasis);
            return this;
        }

        public PolicyDataBuilder dokumentId(UUID dokumentId) {
            documentIds.add(dokumentId);
            return this;
        }

        public PolicyDataBuilder activeToday() {
            start = LocalDate.now();
            end = LocalDate.now();
            return this;
        }
    }
}
