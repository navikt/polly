package no.nav.data.polly.process.dpprocess.domain.sub;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.process.dpprocess.dto.sub.DpDataProcessingRequest;
import no.nav.data.polly.process.dpprocess.dto.sub.DpDataProcessingResponse;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DpDataProcessing {

    private Boolean dataProcessor;

    private List<String> dataProcessorAgreements;
    private Boolean dataProcessorOutsideEU;
    private String transferGroundsOutsideEU;
    private String transferGroundsOutsideEUOther;
    private List<String> transferCountries;

    public DpDataProcessingResponse convertToResponse() {
        return DpDataProcessingResponse.builder()
                .dataProcessor(getDataProcessor())
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

    public static DpDataProcessing convertDataProcessing(DpDataProcessingRequest request) {
        if (request == null) {
            return new DpDataProcessing();
        }
        return DpDataProcessing.builder()
                .dataProcessor(request.getDataProcessor())
                .dataProcessorAgreements(nullToEmptyList(request.getDataProcessorAgreements()))
                .dataProcessorOutsideEU(request.getDataProcessorOutsideEU())
                .transferGroundsOutsideEU(request.getTransferGroundsOutsideEU())
                .transferGroundsOutsideEUOther(request.getTransferGroundsOutsideEUOther())
                .transferCountries(nullToEmptyList(request.getTransferCountries()))
                .build();
    }
}
