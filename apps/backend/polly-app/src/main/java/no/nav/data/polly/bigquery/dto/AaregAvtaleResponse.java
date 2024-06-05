package no.nav.data.polly.bigquery.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import java.time.LocalDateTime;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"avtalenummer", "organisasjonsnummer", "virksomhet"})
public class AaregAvtaleResponse {

    private String avtalenummer;
    private String organisasjonsnummer;
    private String virksomhet;
    private Boolean integrert_oppslag_api;
    private Boolean uttrekk;
    private Boolean web_oppslag;
    private LocalDateTime opprettet;
    private String status;
    private String databehandler_navn;
    private String databehandler_organisasjonsnummer;
    private String virksomhetskategori;
    private String hjemmel_behandlingsgrunnlag_formal;
    private Boolean hendelser;

}
