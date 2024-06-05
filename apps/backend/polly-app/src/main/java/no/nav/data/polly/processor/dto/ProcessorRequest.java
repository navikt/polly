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
import no.nav.data.polly.processor.domain.Processor;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.copyOf;
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
    
    public Processor mergeInto(Processor p) {
        if (isUpdate()) {
            p.setId(UUID.randomUUID());
        }

        p.getData().setName(getName());
        p.getData().setContract(getContract());
        p.getData().setContractOwner(getContractOwner());
        p.getData().setOperationalContractManagers(copyOf(getOperationalContractManagers()));
        p.getData().setNote(getNote());

        p.getData().setOutsideEU(getOutsideEU());
        p.getData().setTransferGroundsOutsideEU(getTransferGroundsOutsideEU());
        p.getData().setTransferGroundsOutsideEUOther(getTransferGroundsOutsideEUOther());
        p.getData().setCountries(copyOf(getCountries()));

        return p;
    }

}
