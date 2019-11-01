package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "legalBasesInherited", "legalBases"})
public class InformationTypePurposeResponse {

    private UUID id;
    private String name;
    private boolean legalBasesInherited;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;
}
