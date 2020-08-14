package no.nav.data.polly.codelist.commoncode.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommonCodeResponse {

    private String code;
    private String description;
    private LocalDate validFrom;
    private LocalDate validTo;

}
