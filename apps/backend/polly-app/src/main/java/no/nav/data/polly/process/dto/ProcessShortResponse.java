package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;

import java.util.List;
import java.util.UUID;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "number", "description", "purposes", "affiliation", "commonExternalProcessResponsible", "status", "changeStamp"})
public class ProcessShortResponse {

    private UUID id;
    private String name;
    private int number;
    private String description;
    private List<CodelistResponse> purposes;
    private AffiliationResponse affiliation;
    private CodelistResponse commonExternalProcessResponsible;
    private ProcessStatus status;
    private ChangeStampResponse changeStamp;

}
