package no.nav.data.polly.databehandler.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DatabehandlerData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull
    private String navn;
    private String avtalereferanse;
    private String avtaleeier;
    @Singular("leggTilFagansvarlig")
    private List<String> fagansvarlig;
    private String merknad;
    private Boolean behandlingUtenforEuEos;
    private String overforingsgrunnlagUtenforEuEos;
    private String overforingsgrunnlagUtenforEuEosAnnet;
    @Singular("leggTilLandDataOverforesTil")
    private List<String> landDataOverforesTil;

    // TODO: Snu avhengigheten innover
    public CodelistResponse getOverforingsgrunnlagUtenforEuEosCodeResponse() {
        // TODO: overforingsgrunnlagUtenforEuEos (kodelisten TRANSFER_GROUNDS_OUTSIDE_EU)
        return CodelistStaticService.getCodelistResponse(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, getOverforingsgrunnlagUtenforEuEos());
    }

}
