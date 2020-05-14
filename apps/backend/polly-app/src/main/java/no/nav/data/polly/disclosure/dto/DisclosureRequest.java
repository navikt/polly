package no.nav.data.polly.disclosure.dto;

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
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.process.dto.ProcessRequest;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;

import static no.nav.data.polly.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.polly.common.utils.DateUtil.ORIG_START;
import static no.nav.data.polly.common.utils.StringUtils.toUpperCaseAndTrim;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DisclosureRequest implements RequestElement {

    private String id;
    private String name;
    private String description;
    @ApiModelProperty(value = "Codelist THIRD_PARTY")
    private String recipient;
    private String recipientPurpose;
    @ApiModelProperty(dataType = LOCAL_DATE, example = ORIG_START)
    private String start;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_END)
    private String end;
    @Singular("legalBasis")
    private List<LegalBasisRequest> legalBases = new ArrayList<>();
    private String documentId;

    private boolean update;
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return getId();
    }

    @Override
    public void format() {
        setRecipient(toUpperCaseAndTrim(getRecipient()));
        setDocumentId(StringUtils.trim(documentId));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, name);
        validator.checkBlank(Fields.description, description);
        validator.checkRequiredCodelist(Fields.recipient, recipient, ListName.THIRD_PARTY);
        validator.checkDate(ProcessRequest.Fields.start, start);
        validator.checkDate(ProcessRequest.Fields.end, end);
        validator.validateType(ProcessRequest.Fields.legalBases, legalBases);
        validator.checkUUID(Fields.documentId, documentId);
    }
}
