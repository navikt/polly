package no.nav.data.polly.process.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProcessVeryShortResponse {

    private UUID id;
    private String name;
    private int number;
    private List<CodelistResponse> purposes;
    private AffiliationResponse affiliation;

}
