package no.nav.data.polly.process.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.process.dto.sub.DataProcessingRequest;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.copyOf;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DataProcessing {

    private Boolean dataProcessor;
    private List<UUID> processors;

    private List<String> dataProcessorAgreements;
    private Boolean dataProcessorOutsideEU;
    private String transferGroundsOutsideEU;
    private String transferGroundsOutsideEUOther;
    private List<String> transferCountries;

    public DataProcessingResponse convertToResponse() {
        return DataProcessingResponse.builder()
                .dataProcessor(getDataProcessor())
                .processors(copyOf(processors))
                .build();
    }

    public static DataProcessing convertDataProcessing(DataProcessingRequest request) {
        if (request == null) {
            return new DataProcessing();
        }
        return DataProcessing.builder()
                .dataProcessor(request.getDataProcessor())
                .processors(convert(request.getProcessors(), UUID::fromString))
                .build();
    }
}
