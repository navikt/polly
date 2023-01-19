package no.nav.data.polly.bigquery.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.bigquery.dto.EtterlevelseDataResponse;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EtterlevelseData {

//REFACTOR TO AAREG CLASS

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

    public EtterlevelseDataResponse toResponse() {
        return EtterlevelseDataResponse.builder()
                .id(id)
                .behandlingId(behandlingId)
                .kravNummer(kravNummer)
                .kravVersjon(kravVersjon)
                .etterleves(etterleves)
                .dokumentasjon(dokumentasjon)
                .fristForFerdigstillelse(fristForFerdigstillelse)
                .status(status)
                .suksesskriterieBegrunnelser(suksesskriterieBegrunnelser)
                .version(version)
                .statusBegrunnelse(statusBegrunnelse)
                .changeStamp_lastModifiedDate(changeStamp_lastModifiedDate)
                .changeStamp_createdDate(changeStamp_createdDate)
                .build();
    }

}
