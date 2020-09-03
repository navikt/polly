package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.dto.sub.AffiliationResponse;

import java.util.UUID;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "purpose", "affiliation", "status"})
public class ProcessShortResponse {

    private UUID id;
    private String name;
    private CodelistResponse purpose;
    private AffiliationResponse affiliation;
    private ProcessStatus status;

}
