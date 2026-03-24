package no.nav.data.polly.process.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.Period;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.process.domain.sub.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProcessData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull
    private String name;
    @NotNull
    @Singular
    private List<String> purposes;
    private int number;
    private String description;
    private String additionalDescription;

    @NotNull
    private LocalDate start;
    @NotNull
    private LocalDate end;

    private Affiliation affiliation;

    private String commonExternalProcessResponsible;

    @Valid
    @Singular("legalBasis")
    private List<LegalBasis> legalBases = new ArrayList<>();

    private boolean usesAllInformationTypes;
    private Boolean automaticProcessing;
    private Boolean profiling;
    @Default
    private AiUsageDescription aiUsageDescription = new AiUsageDescription();
    @Default
    private DataProcessing dataProcessing = new DataProcessing();
    @Default
    private Retention retention = new Retention();
    @Default
    private Dpia dpia = new Dpia();
    @Default
    private ProcessStatus status = ProcessStatus.IN_PROGRESS;
    private String revisionText;

    public Period toPeriod() {
        return new Period(start, end);
    }

    public AiUsageDescription getAiUsageDescription() {
        if (aiUsageDescription == null) {
            aiUsageDescription = new AiUsageDescription();
        }
        return aiUsageDescription;
    }

    public DataProcessing getDataProcessing() {
        if (dataProcessing == null) {
            dataProcessing = new DataProcessing();
        }
        return dataProcessing;
    }

    public Retention getRetention() {
        if (retention == null) {
            retention = new Retention();
        }
        return retention;
    }

    public Dpia getDpia() {
        if (dpia == null) {
            dpia = new Dpia();
        }
        return dpia;
    }

    public Affiliation getAffiliation() {
        if (affiliation == null) {
            affiliation = new Affiliation();
        }
        return affiliation;
    }
    
}
