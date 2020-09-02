package no.nav.data.polly.process.dto.sub;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.Validated;
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
public class DataProcessingRequest implements Validated {

    private Boolean dataProcessor;
    private List<String> dataProcessorAgreements;
    private Boolean dataProcessorOutsideEU;
    @ApiModelProperty(value = "Codelist TRANSFER_GROUNDS_OUTSIDE_EU")
    private String transferGroundsOutsideEU;
    private String transferGroundsOutsideEUOther;
    private List<String> transferCountries;

    @Override
    public void format() {
        setDataProcessorAgreements(formatList(getDataProcessorAgreements()));
        if (Boolean.FALSE.equals(getDataProcessor())) {
            setDataProcessorAgreements(List.of());
            setDataProcessorOutsideEU(null);
        }
        if (!Boolean.TRUE.equals(getDataProcessorOutsideEU())) {
            setTransferGroundsOutsideEU(null);
            setTransferGroundsOutsideEUOther(null);
            setTransferCountries(List.of());
        } else {
            setTransferGroundsOutsideEU(toUpperCaseAndTrim(getTransferGroundsOutsideEU()));
            setTransferGroundsOutsideEUOther(trimToNull(getTransferGroundsOutsideEUOther()));
            setTransferCountries(formatList(getTransferCountries()));
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        if (Boolean.TRUE.equals(getDataProcessorOutsideEU())) {
            validator.checkRequiredCodelist(DataProcessingRequest.Fields.transferGroundsOutsideEU, transferGroundsOutsideEU, ListName.TRANSFER_GROUNDS_OUTSIDE_EU);
        }
    }
}
