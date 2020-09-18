package no.nav.data.polly.process.dto.sub;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"dataProcessor", "dataProcessorAgreements", "dataProcessorOutsideEU", "transferGroundsOutsideEU", "transferGroundsOutsideEUOther", "transferCountries"})
public class DataProcessingResponse {

    private Boolean dataProcessor;
    @Singular
    private List<String> dataProcessorAgreements;
    private Boolean dataProcessorOutsideEU;
    private CodelistResponse transferGroundsOutsideEU;
    private String transferGroundsOutsideEUOther;
    private List<String> transferCountries;
}
