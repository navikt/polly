package no.nav.data.polly.disclosure.dto;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.With;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.process.dto.ProcessRequest;

import java.util.ArrayList;
import java.util.List;

import static no.nav.data.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.common.utils.DateUtil.ORIG_START;
import static no.nav.data.common.utils.StringUtils.formatList;
import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;
import static org.apache.commons.lang3.StringUtils.trimToNull;

@With
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DisclosureRequest implements RequestElement {

    private String id;
    private String name;
    private String description;
    @Schema(description = "Codelist THIRD_PARTY")
    private String recipient;
    private String recipientPurpose;
    @Schema(type = LOCAL_DATE, example = ORIG_START)
    private String start;
    @Schema(type = LOCAL_DATE, example = DEFAULT_END)
    private String end;
    @Singular("legalBasis")
    private List<LegalBasisRequest> legalBases = new ArrayList<>();
    private String documentId;
    private List<String> processIds;
    private List<String> informationTypeIds;
    private DisclosureAbroadRequest abroad;
    private Boolean thirdCountryReceiver;
    private String administrationArchiveCaseNumber;
    private Boolean assessedConfidentiality;
    private String confidentialityDescription;

    private boolean update;
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return getId();
    }

    @Override
    public void format() {
        setRecipient(toUpperCaseAndTrim(getRecipient()));
        setName(trimToNull(getName()));
        setDescription(trimToNull(getDescription()));
        setRecipientPurpose(trimToNull(getRecipientPurpose()));
        setDocumentId(trimToNull(getDocumentId()));
        setProcessIds(formatList(getProcessIds()));
        setInformationTypeIds(formatList(getInformationTypeIds()));
        setAdministrationArchiveCaseNumber(trimToNull(getAdministrationArchiveCaseNumber()));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, name);
        validator.checkRequiredCodelist(Fields.recipient, recipient, ListName.THIRD_PARTY);
        validator.checkDate(ProcessRequest.Fields.start, start);
        validator.checkDate(ProcessRequest.Fields.end, end);
        validator.validateType(ProcessRequest.Fields.legalBases, legalBases);
        validator.checkUUID(Fields.documentId, documentId);
        getProcessIds().forEach(it -> validator.checkUUID(Fields.processIds, it));
        getInformationTypeIds().forEach(it -> validator.checkUUID(Fields.informationTypeIds, it));
    }
}
