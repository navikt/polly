package no.nav.data.integration.etterlevelse.domain;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@FieldNameConstants
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({ "etterlevelseDokumentasjonId", "status"})
public class PvkDokumentShort {
    private UUID etterlevelseDokumentasjonId;
    private Integer etterlevelseNummer;
    private String title;
    private Integer etterlevelseDokumentVersjon;

    private UUID pvkDokumentId;
    private PvkVurdering pvkVurdering;
    private PvkDokumentStatus status;
    private List<EtterlevelseCodeListResponse> ytterligereEgenskaper;
    private boolean hasPvkDocumentationStarted;
}
