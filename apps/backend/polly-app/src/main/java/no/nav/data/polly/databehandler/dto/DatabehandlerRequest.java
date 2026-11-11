package no.nav.data.polly.databehandler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.databehandler.domain.Databehandler;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.copyOf;
import static no.nav.data.common.utils.StringUtils.formatList;
import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;
import static org.apache.commons.lang3.StringUtils.trimToNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DatabehandlerRequest implements RequestElement {

    private String id;
    private String navn;
    private String avtalereferanse;
    private String avtaleeier;

    @Singular("leggTilFagansvarlig")
    private List<String> fagansvarlig;
    private String merknad;

    private Boolean behandlingUtenforEuEos;
    @Schema(description = "Codelist TRANSFER_GROUNDS_OUTSIDE_EU")
    private String overforingsgrunnlagUtenforEuEos;
    private String overforingsgrunnlagUtenforEuEosAnnet;
    @Singular("leggTilLandDataOverforesTil")
    private List<String> landDataOverforesTil;

    private boolean update;
    private int requestIndex;

    @Schema(description = "Versjonen klienten sist leste. Må sendes ved oppdatering (optimistisk låsing)")
    private Integer version; // For optimistisk låsing, må sendes ved oppdatering, og ikke kopieres til entity.

    @Override
    public String getIdentifyingFields() {
        return navn;
    }

    @Override
    public void format() {
        setNavn(trimToNull(navn));
        setAvtalereferanse(trimToNull(avtalereferanse));
        setAvtaleeier(trimToNull(avtaleeier));
        setFagansvarlig(formatList(fagansvarlig));
        setMerknad(trimToNull(merknad));
        if (!Boolean.TRUE.equals(getBehandlingUtenforEuEos())) {
            setOverforingsgrunnlagUtenforEuEos(null);
            setOverforingsgrunnlagUtenforEuEosAnnet(null);
            setLandDataOverforesTil(List.of());
        } else {
            setOverforingsgrunnlagUtenforEuEos(toUpperCaseAndTrim(getOverforingsgrunnlagUtenforEuEos()));
            setOverforingsgrunnlagUtenforEuEosAnnet(trimToNull(getOverforingsgrunnlagUtenforEuEosAnnet()));
            setLandDataOverforesTil(formatList(getLandDataOverforesTil()));
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        if (Boolean.TRUE.equals(getBehandlingUtenforEuEos())) {
            // TODO: overforingsgrunnlagUtenforEuEos (kodelisten TRANSFER_GROUNDS_OUTSIDE_EU)
            validator.checkRequiredCodelist(Fields.overforingsgrunnlagUtenforEuEos, overforingsgrunnlagUtenforEuEos, ListName.TRANSFER_GROUNDS_OUTSIDE_EU);
        }
    }
    
}
