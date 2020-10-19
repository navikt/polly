package no.nav.data.polly.process.dpprocess.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;

import java.util.UUID;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "affiliation"})
public class DpProcessShortResponse {

    private UUID id;
    private String name;
    private AffiliationResponse affiliation;

}
