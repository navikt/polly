package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;

import java.util.List;

import static no.nav.data.polly.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_START;
import static no.nav.data.polly.common.utils.StringUtils.toUpperCaseAndTrim;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
@JsonPropertyOrder({"id,", "name", "purposeCode", "start", "end", "legalBases"})
public class ProcessRequest implements RequestElement {

    private String id;
    private String name;
    @ApiModelProperty(value = "Codelist PURPOSE")
    private String purposeCode;
    @ApiModelProperty(value = "Codelist DEPARTMENT")
    private String department;
    @ApiModelProperty(value = "Codelist SUB_DEPARTMENT")
    private String subDepartment;
    private String productTeam;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_START)
    private String start;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_END)
    private String end;
    private List<LegalBasisRequest> legalBases;

    private boolean update;
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public void format() {
        setPurposeCode(toUpperCaseAndTrim(getPurposeCode()));
        setDepartment(toUpperCaseAndTrim(getDepartment()));
        setSubDepartment(toUpperCaseAndTrim(getSubDepartment()));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, name);
        validator.checkRequiredCodelist(Fields.purposeCode, purposeCode, ListName.PURPOSE);
        validator.checkCodelist(Fields.department, department, ListName.DEPARTMENT);
        validator.checkCodelist(Fields.subDepartment, subDepartment, ListName.SUB_DEPARTMENT);
        validator.checkDate(Fields.start, start);
        validator.checkDate(Fields.end, end);
        validator.validateType(Fields.legalBases, legalBases);
    }

}
