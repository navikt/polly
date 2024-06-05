package no.nav.data.common.rest;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.common.auditing.domain.Auditable.Fields;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({Fields.lastModifiedBy, Fields.lastModifiedDate})
public class ChangeStampResponse {

    private String lastModifiedBy;
    private LocalDateTime lastModifiedDate;
    private LocalDateTime createdDate;
    
    public static ChangeStampResponse from(Auditable auditable) {
        return ChangeStampResponse.builder()
                .lastModifiedBy(auditable.getLastModifiedBy())
                .lastModifiedDate(auditable.getLastModifiedDate() == null ? LocalDateTime.now() : auditable.getLastModifiedDate())
                .createdDate(auditable.getCreatedDate())
                .build();
    }

}
