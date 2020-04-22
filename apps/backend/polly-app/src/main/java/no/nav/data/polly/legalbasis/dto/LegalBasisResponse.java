package no.nav.data.polly.legalbasis.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.dto.CodelistResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"gdpr", "nationalLaw", "description"})
public class LegalBasisResponse {

    private CodelistResponse gdpr;
    private CodelistResponse nationalLaw;
    private String description;

}
