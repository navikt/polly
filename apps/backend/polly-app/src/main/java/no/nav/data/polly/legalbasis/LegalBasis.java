package no.nav.data.polly.legalbasis;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalBasis {

    @NotNull
    private String gdpr;
    private String nationalLaw;
    @NotNull
    private String description;

}
