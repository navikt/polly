package no.nav.data.polly.purpose.domain;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.legalbasis.LegalBasisResponse;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "legalBases"})
public class InformationTypePurposeResponse {

    private UUID id;
    private String name;
    private List<LegalBasisResponse> legalBases;
}
