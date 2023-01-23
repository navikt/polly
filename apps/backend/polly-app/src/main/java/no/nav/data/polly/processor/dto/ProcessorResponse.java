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

import java.util.List;
import java.util.UUID;

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
    private List<String> aaregContractIds;
    private Boolean outsideEU;
    @Schema(description = "Codelist TRANSFER_GROUNDS_OUTSIDE_EU")
    private CodelistResponse transferGroundsOutsideEU;
    private String transferGroundsOutsideEUOther;
    @Singular
    private List<String> countries;

    private ChangeStampResponse changeStamp;
}
