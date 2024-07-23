package no.nav.data.polly.process.dpprocess.dto;


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
import no.nav.data.polly.process.dpprocess.dto.sub.DpRetentionRequest;
import no.nav.data.polly.process.dto.sub.AffiliationRequest;
import no.nav.data.polly.process.dto.sub.DataProcessingRequest;

import java.util.List;

import static no.nav.data.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.common.utils.DateUtil.ORIG_START;
import static no.nav.data.common.utils.StringUtils.formatList;
import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;
import static org.apache.commons.lang3.StringUtils.trimToNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DpProcessRequest implements RequestElement {

    private String id;
    private String name;
    private AffiliationRequest affiliation;
    @Schema(description = "Codelist THIRD_PARTY")
    private String externalProcessResponsible;

    @Schema(type = LOCAL_DATE, example = ORIG_START)
    private String start;
    @Schema(type = LOCAL_DATE, example = DEFAULT_END)
    private String end;

    @Singular
    private List<String> dataProcessingAgreements;
    private DataProcessingRequest subDataProcessing;

    private String purposeDescription;
    private String description;
    private Boolean art9;
    private Boolean art10;

    private DpRetentionRequest retention;
    private int newDpProcessNmber;

    private boolean update;
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public void format() {
        setExternalProcessResponsible(toUpperCaseAndTrim(getExternalProcessResponsible()));
        setName(trimToNull(getName()));
        setPurposeDescription(trimToNull(getPurposeDescription()));
        setDescription(trimToNull(getDescription()));
        setDataProcessingAgreements(formatList(getDataProcessingAgreements()));

        setAffiliation(getAffiliation() != null ? getAffiliation() : new AffiliationRequest());
        setSubDataProcessing(getSubDataProcessing() != null ? getSubDataProcessing() : new DataProcessingRequest());
        setRetention(getRetention() != null ? getRetention() : new DpRetentionRequest());
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, name);
        validator.checkCodelist(Fields.externalProcessResponsible, externalProcessResponsible, ListName.THIRD_PARTY);
        validator.validateType(Fields.affiliation, affiliation);
        validator.validateType(Fields.subDataProcessing, subDataProcessing);
        validator.validateType(Fields.retention, retention);
    }
}
