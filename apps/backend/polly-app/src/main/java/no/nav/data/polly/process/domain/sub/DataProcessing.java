package no.nav.data.polly.process.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.dto.sub.DataProcessingRequest;
import no.nav.data.polly.process.dto.sub.DataProcessingResponse;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.copyOf;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;

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
                .dataProcessorAgreements(nullToEmptyList(getDataProcessorAgreements()))
                .dataProcessorOutsideEU(getDataProcessorOutsideEU())
                .transferGroundsOutsideEU(getTransferGroundsOutsideEUCodeResponse())
                .transferGroundsOutsideEUOther(getTransferGroundsOutsideEUOther())
                .transferCountries(nullToEmptyList(getTransferCountries()))
                .build();
    }

    private CodelistResponse getTransferGroundsOutsideEUCodeResponse() {
        return CodelistService.getCodelistResponse(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, getTransferGroundsOutsideEU());
    }

    public static DataProcessing convertDataProcessing(DataProcessingRequest request) {
        if (request == null) {
            return new DataProcessing();
        }
        return DataProcessing.builder()
                .dataProcessor(request.getDataProcessor())
                .processors(convert(request.getProcessors(), UUID::fromString))
                .dataProcessorAgreements(nullToEmptyList(request.getDataProcessorAgreements()))
                .dataProcessorOutsideEU(request.getDataProcessorOutsideEU())
                .transferGroundsOutsideEU(request.getTransferGroundsOutsideEU())
                .transferGroundsOutsideEUOther(request.getTransferGroundsOutsideEUOther())
                .transferCountries(nullToEmptyList(request.getTransferCountries()))
                .build();
    }
}
