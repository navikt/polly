package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.legalbasis.domain.LegalBasis;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProcessData {

    @NotNull
    private LocalDate start;
    @NotNull
    private LocalDate end;
    private String department;
    private String subDepartment;
    @Valid
    private List<LegalBasis> legalBases = new ArrayList<>();

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class ProcessDataBuilder {

        private List<LegalBasis> legalBases = new ArrayList<>();

        public ProcessDataBuilder legalBasis(LegalBasis legalBasis) {
            legalBases.add(legalBasis);
            return this;
        }
    }
}
