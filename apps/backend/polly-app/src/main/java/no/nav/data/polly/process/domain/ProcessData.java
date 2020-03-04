package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
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
    private List<String> products;
    @Valid
    private List<LegalBasis> legalBases = new ArrayList<>();

    private Boolean usesAllInformationTypes;
    private Boolean automaticProcessing;
    private Boolean profiling;
    @Default
    private DataProcessing dataProcessing = new DataProcessing();
    @Default
    private Retention retention = new Retention();

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DataProcessing {

        private Boolean dataProcessor;
        private List<String> dataProcessorAgreements;
        private Boolean dataProcessorOutsideEU;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Retention {

        private Boolean retentionPlan;
        private Integer retentionMonths;
        private String retentionStart;
        private String retentionDescription;
    }

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
