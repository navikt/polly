package no.nav.data.polly.bigquery.domain;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.bigquery.dto.AaregAvtalerResponse;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AaregAvtale {
    private String avtalenummer;
   private String organisasjonsnummer;
   private String virksomhet;
  private Boolean  integrert_oppslag_api;
   private Boolean uttrekk;
  private Boolean  web_oppslag;
  private LocalDateTime opprettet;
   private String status;
   private String databehandler_navn;
   private String databehandler_organisasjonsnummer;
  private String  virksomhetskategori;
  private String  hjemmel_behandlingsgrunnlag_formal;
   private Boolean hendelser;


   public AaregAvtaleResponse toResponse() {
       return AaregAvtalerResponse.builder()
               .avtalenummer(avtalenummer)


   }
}
