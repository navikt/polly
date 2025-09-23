package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.sub.AiUsageDescription;
import no.nav.data.polly.process.dto.sub.*;

import java.util.List;

import static no.nav.data.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.common.utils.DateUtil.ORIG_START;
import static no.nav.data.common.utils.StringUtils.formatListToUppercase;
import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;
import static org.apache.commons.lang3.StringUtils.trimToNull;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class ProcessRequest implements RequestElement {

    private String id;
    private String name;
    private String description;
    private String additionalDescription;
    @Singular
    @Schema(description = "Codelist PURPOSE")
    private List<String> purposes;
    @Schema(description = "Codelist THIRD_PARTY")
    private String commonExternalProcessResponsible;
    private AffiliationRequest affiliation;

    @Schema(type = LOCAL_DATE, example = ORIG_START)
    private String start;
    @Schema(type = LOCAL_DATE, example = DEFAULT_END)
    private String end;
    private List<LegalBasisRequest> legalBases;

    private boolean usesAllInformationTypes;
    private Boolean automaticProcessing;
    private Boolean profiling;
    private AiUsageDescriptionRequest aiUsageDescription;
    private DataProcessingRequest dataProcessing;
    private RetentionRequest retention;
    private DpiaRequest dpia;
    private ProcessStatus status;

    private boolean update;
    private int requestIndex;

    @JsonIgnore
    private int newProcessNumber;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public void format() {
        setPurposes(formatListToUppercase(getPurposes()));
        setCommonExternalProcessResponsible(toUpperCaseAndTrim(getCommonExternalProcessResponsible()));
        setDescription(trimToNull(getDescription()));
        setAdditionalDescription(trimToNull(getAdditionalDescription()));

        setAffiliation(getAffiliation() != null ? getAffiliation() : new AffiliationRequest());
        setDataProcessing(getDataProcessing() != null ? getDataProcessing() : new DataProcessingRequest());
        setAiUsageDescription(getAiUsageDescription() != null ? getAiUsageDescription() : new AiUsageDescriptionRequest());
        setRetention(getRetention() != null ? getRetention() : new RetentionRequest());
        setDpia(getDpia() != null ? getDpia() : new DpiaRequest());

        if (status == null) {
            setStatus(ProcessStatus.IN_PROGRESS);
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, name);
        validator.checkRequiredCodelists(Fields.purposes, purposes, ListName.PURPOSE);
        validator.checkCodelist(Fields.commonExternalProcessResponsible, commonExternalProcessResponsible, ListName.THIRD_PARTY);
        validator.checkDate(Fields.start, start);
        validator.checkDate(Fields.end, end);
        validator.validateType(Fields.legalBases, legalBases);

        validator.validateType(Fields.affiliation, affiliation);
        validator.validateType(Fields.dataProcessing, dataProcessing);
        validator.validateType(Fields.retention, retention);
        validator.validateType(Fields.dpia, dpia);
        validator.validateType(Fields.aiUsageDescription, aiUsageDescription);
        validator.checkDate(Fields.end, end);
    }

}
