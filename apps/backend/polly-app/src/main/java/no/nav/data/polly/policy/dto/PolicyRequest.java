package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.utils.StringUtils;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;

import java.util.List;

import static no.nav.data.polly.common.swagger.SwaggerConfig.BOOLEAN;
import static no.nav.data.polly.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_START;
import static no.nav.data.polly.common.utils.StreamUtils.convert;
import static no.nav.data.polly.common.utils.StringUtils.toUpperCaseAndTrim;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
public class PolicyRequest implements RequestElement {

    private String id;
    private String process;
    @ApiModelProperty(value = "Codelist PURPOSE")
    private String purposeCode;
    @Singular
    @ApiModelProperty(value = "Codelist SUBJECT_CATEGORY")
    private List<String> subjectCategories;
    private String informationTypeName;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_START)
    private String start;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_END)
    private String end;
    @ApiModelProperty(dataType = BOOLEAN)
    private String legalBasesInherited;
    private List<LegalBasisRequest> legalBases;

    private int requestIndex;
    private boolean update;

    @JsonIgnore
    private InformationType informationType;
    @JsonIgnore
    private Policy existingPolicy;

    @Override
    public String getIdentifyingFields() {
        return process + "-" + purposeCode + "-" + subjectCategories + "-" + informationTypeName;
    }

    @JsonIgnore
    @Override
    public String getReference() {
        return getInformationTypeName() + "/" + getPurposeCode();
    }

    @Override
    public void format() {
        setPurposeCode(toUpperCaseAndTrim(getPurposeCode()));
        setSubjectCategories(convert(getSubjectCategories(), StringUtils::toUpperCaseAndTrim));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkRequiredCodelist(Fields.purposeCode, purposeCode, ListName.PURPOSE);
        validator.checkBlank(Fields.informationTypeName, informationTypeName);
        validator.checkBlank(Fields.process, process);
        validator.checkRequiredCodelists(Fields.subjectCategories, subjectCategories, ListName.SUBJECT_CATEGORY);
        validator.checkDate(Fields.start, start);
        validator.checkDate(Fields.end, end);
        validator.validateType(Fields.legalBases, legalBases);
        validator.checkId(this);
    }

}
