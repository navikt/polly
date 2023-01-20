package no.nav.data.polly.bigquery.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;
import no.nav.data.polly.policy.dto.PolicyResponse;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;
import no.nav.data.polly.process.dto.sub.DpiaResponse;
import no.nav.data.polly.process.dto.sub.RetentionResponse;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"avtalenummer", "organisasjonsnummer", "virksomhet"})

public class AaregAvtalerResponse {

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
