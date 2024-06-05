package no.nav.data.polly.bigquery.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AaregAvtale {
    
    private String avtalenummer;
    private String organisasjonsnummer;
    private String virksomhet;
    private Boolean integrert_oppslag_api;
    private Boolean uttrekk;
    private Boolean web_oppslag;
    private String opprettet;
    private String status;
    private String databehandler_navn;
    private String databehandler_organisasjonsnummer;
    private String virksomhetskategori;
    private String hjemmel_behandlingsgrunnlag_formal;
    private Boolean hendelser;


    public PollyAaregAvtale toPollyAaregAvtale() {
        return PollyAaregAvtale.builder()
                .id(avtalenummer)
                .organisasjonsnummer(organisasjonsnummer)
                .virksomhet(virksomhet)
                .integrert_oppslag_api(integrert_oppslag_api)
                .uttrekk(uttrekk)
                .web_oppslag(web_oppslag)
                .opprettet(opprettet)
                .status(status)
                .databehandler_navn(databehandler_navn)
                .databehandler_organisasjonsnummer(databehandler_organisasjonsnummer)
                .virksomhetskategori(virksomhetskategori)
                .hjemmel_behandlingsgrunnlag_formal(hjemmel_behandlingsgrunnlag_formal)
                .hendelser(hendelser)
                .build();
    }
}
