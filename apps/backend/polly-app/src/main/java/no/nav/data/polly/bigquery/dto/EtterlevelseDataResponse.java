package no.nav.data.polly.bigquery.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "behandlingId", "kravNummer"})
public class EtterlevelseDataResponse {

    // REFACTOR TO AAREG CLASS
    private String id;
    private String behandlingId;
    private int kravNummer;
    private int kravVersjon;
    private boolean etterleves;
    private String dokumentasjon;
    private String fristForFerdigstillelse;
    private String status;
    private String suksesskriterieBegrunnelser;
    private int version;
    private String statusBegrunnelse;
    private String changeStamp_lastModifiedDate;
    private String changeStamp_createdDate;
}
