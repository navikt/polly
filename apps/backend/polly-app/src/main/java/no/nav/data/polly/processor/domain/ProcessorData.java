package no.nav.data.polly.processor.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProcessorData {

    @NotNull
    private String name;
    private String contract;
    private String contractOwner;
    @Singular
    private List<String> operationalContractManagers;
    private String note;
    private Boolean outsideEU;
    private String transferGroundsOutsideEU;
    private String transferGroundsOutsideEUOther;
    @Singular
    private List<String> countries;

    // TODO: Snu avhengigheten innover
    public CodelistResponse getTransferGroundsOutsideEUCodeResponse() {
        return CodelistService.getCodelistResponse(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, getTransferGroundsOutsideEU());
    }

}
