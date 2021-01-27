package no.nav.data.polly.disclosure.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.dto.ProcessVeryShortResponse;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "recipient", "processes", "legalBases"})
public class DisclosureSummaryResponse {

    private UUID id;
    private String name;
    private CodelistResponse recipient;
    private List<ProcessVeryShortResponse> processes;
    private Integer legalBases;

}
