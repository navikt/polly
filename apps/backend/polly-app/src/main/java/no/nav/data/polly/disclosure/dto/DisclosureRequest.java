package no.nav.data.polly.disclosure.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldNameConstants;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.process.dto.ProcessRequest;

import java.util.ArrayList;
import java.util.List;

import static no.nav.data.polly.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_START;
import static no.nav.data.polly.common.utils.StringUtils.toUpperCaseAndTrim;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DisclosureRequest implements RequestElement {

    private String id;
    private String description;
    @ApiModelProperty(value = "Codelist THIRD_PARTY", example = "CODELIST")
    private String recipient;
    private String recipientPurpose;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_START)
    private String start;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_END)
    private String end;
    @Singular("legalBasis")
    private List<LegalBasisRequest> legalBases = new ArrayList<>();
    @Singular
    private List<String> informationTypes = new ArrayList<>();

    private boolean update;
    private int requestIndex;
    @Builder.Default
    @JsonIgnore
    private List<InformationType> informationTypesData = new ArrayList<>();

    @Override
    public String getIdentifyingFields() {
        return getId();
    }

    @Override
    public void format() {
        setRecipient(toUpperCaseAndTrim(getRecipient()));
        setInformationTypes(informationTypes == null ? List.of() : informationTypes);
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.description, description);
        validator.checkRequiredCodelist(Fields.recipient, recipient, ListName.SOURCE);
        validator.checkBlank(Fields.recipientPurpose, recipientPurpose);
        validator.checkDate(ProcessRequest.Fields.start, start);
        validator.checkDate(ProcessRequest.Fields.end, end);
        validator.validateType(ProcessRequest.Fields.legalBases, legalBases);
    }
}
