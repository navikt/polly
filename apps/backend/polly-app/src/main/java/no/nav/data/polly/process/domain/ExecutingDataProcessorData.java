package no.nav.data.polly.process.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.domain.sub.DataProcessing;
import no.nav.data.polly.process.domain.sub.Retention;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
/**
 * Great name..... pls
 */
public class ExecutingDataProcessorData {

    private String name;
    @Default
    private Affiliation affiliation = new Affiliation();
    private String externalProcessResponsible;

    private Boolean hasAgreement;
    private List<String> agreements;
    @Default
    private DataProcessing subDataProcessing = new DataProcessing();

    private String purposeDescription;
    private String description;
    private Boolean art9;
    private Boolean art10;

    // TODO indefinite ?
    @Default
    private Retention retention = new Retention();

}
