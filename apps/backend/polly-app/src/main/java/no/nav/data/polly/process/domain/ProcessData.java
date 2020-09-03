package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.Period;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.domain.sub.Dpia;
import no.nav.data.polly.process.domain.sub.Retention;

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
    private List<String> subDepartments;
    private List<String> productTeams;
    private List<String> products;

    private String commonExternalProcessResponsible;

    @Valid
    private List<LegalBasis> legalBases = new ArrayList<>();

    private boolean usesAllInformationTypes;
    private Boolean automaticProcessing;
    private Boolean profiling;
    @Default
    private DataProcessing dataProcessing = new DataProcessing();
    @Default
    private Retention retention = new Retention();
    @Default
    private Dpia dpia = new Dpia();
    @Default
    private ProcessStatus status = ProcessStatus.IN_PROGRESS;

    public Period toPeriod() {
        return new Period(start, end);
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class ProcessDataBuilder {

        private List<String> subDepartments = new ArrayList<>();
        private List<LegalBasis> legalBases = new ArrayList<>();
        private List<String> dataProcessorAgreements = new ArrayList<>();

        public ProcessDataBuilder subDepartment(String subDepartment) {
            subDepartments.add(subDepartment);
            return this;
        }

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
