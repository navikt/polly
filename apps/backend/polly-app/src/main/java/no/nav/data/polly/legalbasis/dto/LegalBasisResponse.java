package no.nav.data.polly.legalbasis.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.common.utils.DateUtil;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"gdpr", "nationalLaw", "description", "start", "end", "active"})
public class LegalBasisResponse {

    private String gdpr;
    private String nationalLaw;
    private String description;
    private LocalDate start;
    private LocalDate end;

    public boolean isActive() {
        return DateUtil.isNow(start, end);
    }

}
