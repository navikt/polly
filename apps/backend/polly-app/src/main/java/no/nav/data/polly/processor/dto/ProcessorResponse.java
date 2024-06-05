package no.nav.data.polly.processor.dto;


import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.common.rest.ChangeStampResponse;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.processor.domain.Processor;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.copyOf;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "contract", "contractOwner", "operationalContractManagers", "note",
        "outsideEU", "transferGroundsOutsideEU", "transferGroundsOutsideEUOther", "countries"})
public class ProcessorResponse {

    private UUID id;
    private String name;
    private String contract;
    private String contractOwner;
    @Singular
    private List<String> operationalContractManagers;
    private String note;

    private Boolean outsideEU;
    @Schema(description = "Codelist TRANSFER_GROUNDS_OUTSIDE_EU")
    private CodelistResponse transferGroundsOutsideEU;
    private String transferGroundsOutsideEUOther;
    @Singular
    private List<String> countries;

    private ChangeStampResponse changeStamp;
    
    public static ProcessorResponse buidFrom(Processor p) {
        return ProcessorResponse.builder()
                .id(p.getId())
                .name(p.getData().getName())
                .contract(p.getData().getContract())
                .contractOwner(p.getData().getContractOwner())
                .operationalContractManagers(copyOf(p.getData().getOperationalContractManagers()))
                .note(p.getData().getNote())
                .transferGroundsOutsideEU(p.getData().getTransferGroundsOutsideEUCodeResponse())
                .transferGroundsOutsideEUOther(p.getData().getTransferGroundsOutsideEUOther())
                .outsideEU(p.getData().getOutsideEU())
                .countries(p.getData().getCountries())
                .changeStamp(p.convertChangeStampResponse())
                .build();
    }

}
