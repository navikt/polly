package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id,", "name", "purposeCode", "legalBases"})
public class ProcessResponse {

    private String id;
    private String name;
    private String purposeCode;
    @Singular("legalBasis")
    private List<LegalBasisResponse> legalBases;

}
