package no.nav.data.polly.processor.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.polly.codelist.domain.ListName;

import java.util.List;

import static no.nav.data.common.utils.StringUtils.formatList;
import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;
import static org.apache.commons.lang3.StringUtils.trimToNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class ProcessorRequest implements RequestElement {

    private String id;
    private String name;
    private String contract;
    private String contractOwner;
    private List<String> aaregContractIds;
    @Singular
    private List<String> operationalContractManagers;
    private String note;

    private Boolean outsideEU;
    @Schema(description = "Codelist TRANSFER_GROUNDS_OUTSIDE_EU")
    private String transferGroundsOutsideEU;
    private String transferGroundsOutsideEUOther;
    @Singular
    private List<String> countries;

    private boolean update;
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public void format() {
        setName(trimToNull(name));
        setContract(trimToNull(contract));
        setContractOwner(trimToNull(contractOwner));
        setOperationalContractManagers(formatList(operationalContractManagers));
        setNote(trimToNull(note));
        setAaregContractIds(formatList(getAaregContractIds()));
        if (!Boolean.TRUE.equals(getOutsideEU())) {
            setTransferGroundsOutsideEU(null);
            setTransferGroundsOutsideEUOther(null);
            setCountries(List.of());
        } else {
            setTransferGroundsOutsideEU(toUpperCaseAndTrim(getTransferGroundsOutsideEU()));
            setTransferGroundsOutsideEUOther(trimToNull(getTransferGroundsOutsideEUOther()));
            setCountries(formatList(getCountries()));
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        if (Boolean.TRUE.equals(getOutsideEU())) {
            validator.checkRequiredCodelist(Fields.transferGroundsOutsideEU, transferGroundsOutsideEU, ListName.TRANSFER_GROUNDS_OUTSIDE_EU);
        }
    }
}
