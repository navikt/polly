package no.nav.data.polly.legalbasis.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.io.Serializable;
import javax.validation.constraints.NotNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LegalBasis implements Serializable {

    @NotNull
    private String gdpr;
    private String nationalLaw;
    private String description;

    public LegalBasisResponse convertToResponse() {
        return new LegalBasisResponse(gdprCodelistResponse(), nationalLawCodelistResponse(), description);
    }

    private CodelistResponse gdprCodelistResponse() {
        return CodelistService.getCodelistResponse(ListName.GDPR_ARTICLE, gdpr);
    }

    private CodelistResponse nationalLawCodelistResponse() {
        return CodelistService.getCodelistResponse(ListName.NATIONAL_LAW, nationalLaw);
    }

}