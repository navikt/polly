package no.nav.data.polly.common.rest;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"lastModifiedBy", "lastModifiedDate"})
public class ChangeStampResponse {

    private String lastModifiedBy;
    private LocalDateTime lastModifiedDate;
}
