package no.nav.data.polly.process.dpprocess.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.dpprocess.domain.sub.DpRetention;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DpProcessData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private String name;
    @Default
    private Affiliation affiliation = new Affiliation();
    private String externalProcessResponsible;

    @NotNull
    private LocalDate start;
    @NotNull
    private LocalDate end;

    private List<String> dataProcessingAgreements;
    @Default
    private DataProcessing subDataProcessing = new DataProcessing();

    private String purposeDescription;
    private String description;

    private int dpProcessNumber;
    private Boolean art9;
    private Boolean art10;

    @Default
    private DpRetention retention = new DpRetention();

}
