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

    private String description;
    @NotNull
    private LocalDate start;
    @NotNull
    private LocalDate end;
    private String department;
    private String subDepartment;
    private String productTeam;
    @Valid
    private List<LegalBasis> legalBases = new ArrayList<>();

    private Boolean automaticProcessing;
    private Boolean profiling;
    private Boolean dataProcessor;
    private List<String> dataProcessorAgreements;
    private Boolean dataProcessorOutsideEU;

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class ProcessDataBuilder {

        private List<LegalBasis> legalBases = new ArrayList<>();
        private List<String> dataProcessorAgreements = new ArrayList<>();

        public ProcessDataBuilder legalBasis(LegalBasis legalBasis) {
            legalBases.add(legalBasis);
            return this;
        }

        public ProcessDataBuilder dataProcessorAgreements(String agreement) {
            dataProcessorAgreements.add(agreement);
            return this;
        }
    }
}
