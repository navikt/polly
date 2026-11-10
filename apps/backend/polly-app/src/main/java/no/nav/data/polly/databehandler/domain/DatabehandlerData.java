package no.nav.data.polly.processor.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProcessorData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

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
        return CodelistStaticService.getCodelistResponse(ListName.TRANSFER_GROUNDS_OUTSIDE_EU, getTransferGroundsOutsideEU());
    }

}
