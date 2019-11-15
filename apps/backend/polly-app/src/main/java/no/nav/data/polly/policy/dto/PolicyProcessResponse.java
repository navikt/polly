package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.legalbasis.dto.LegalBasisResponse;

import java.util.List;
import java.util.UUID;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "legalBases"})
public class PolicyProcessResponse {

    private UUID id;
    private String name;
    private List<LegalBasisResponse> legalBases;

}
