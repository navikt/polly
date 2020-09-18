package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.domain.sub.Retention;

import java.time.LocalDate;
import java.util.List;
import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DpProcessData {

    private String name;
    @Default
    private Affiliation affiliation = new Affiliation();
    private String externalProcessResponsible;

    @NotNull
    private LocalDate start;
    @NotNull
    private LocalDate end;

    private Boolean dataProcessingAgreement;
    private List<String> dataProcessingAgreements;
    @Default
    private DataProcessing subDataProcessing = new DataProcessing();

    private String purposeDescription;
    private String description;
    private Boolean art9;
    private Boolean art10;

    @Default
    private Retention retention = new Retention();

}
