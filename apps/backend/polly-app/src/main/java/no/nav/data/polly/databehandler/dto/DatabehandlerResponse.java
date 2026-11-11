package no.nav.data.polly.databehandler.dto;


import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.databehandler.domain.Databehandler;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.copyOf;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "navn", "avtalereferanse", "avtaleeier", "fagansvarlig", "merknad",
        "behandlingUtenforEuEos", "overforingsgrunnlagUtenforEuEos", "overforingsgrunnlagUtenforEuEosAnnet", "landDataOverforesTil"})
public class DatabehandlerResponse {

    private UUID id;
    private String navn;
    private String avtalereferanse;
    private String avtaleeier;
    @Singular("leggTilFagansvarlig")
    private List<String> fagansvarlig;
    private String merknad;

    private Boolean behandlingUtenforEuEos;
    @Schema(description = "Codelist TRANSFER_GROUNDS_OUTSIDE_EU")
    private CodelistResponse overforingsgrunnlagUtenforEuEos;
    private String overforingsgrunnlagUtenforEuEosAnnet;
    @Singular("leggTilLandDataOverforesTil")
    private List<String> landDataOverforesTil;

    private ChangeStampResponse changeStamp;
    @Schema(description = "Versjon for optimistisk låsing. Må sendes tilbake ved oppdatering")
    private Integer version; // For optimistisk låsing, kopieres fra entity (etter flush) og sendes til klienten

    public static DatabehandlerResponse buidFrom(Databehandler d) {
        return DatabehandlerResponse.builder()
                .id(d.getId())
                .navn(d.getData().getNavn())
                .avtalereferanse(d.getData().getAvtalereferanse())
                .avtaleeier(d.getData().getAvtaleeier())
                .fagansvarlig(copyOf(d.getData().getFagansvarlig()))
                .merknad(d.getData().getMerknad())
                .overforingsgrunnlagUtenforEuEos(d.getData().getOverforingsgrunnlagUtenforEuEosCodeResponse())
                .overforingsgrunnlagUtenforEuEosAnnet(d.getData().getOverforingsgrunnlagUtenforEuEosAnnet())
                .behandlingUtenforEuEos(d.getData().getBehandlingUtenforEuEos())
                .landDataOverforesTil(d.getData().getLandDataOverforesTil())
                .changeStamp(d.convertChangeStampResponse())
                .version(d.getVersion())
                .build();
    }

}
