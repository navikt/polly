package no.nav.data.polly.process.dto;

import io.swagger.annotations.ApiModelProperty;
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
import no.nav.data.polly.process.dto.sub.DataProcessingRequest;
import no.nav.data.polly.process.dto.sub.DpiaRequest;
import no.nav.data.polly.process.dto.sub.RetentionRequest;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

import static no.nav.data.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.common.utils.DateUtil.ORIG_START;
import static no.nav.data.common.utils.StringUtils.formatList;
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
    @ApiModelProperty(value = "Codelist PURPOSE")
    private String purposeCode;
    @ApiModelProperty(value = "Codelist DEPARTMENT")
    private String department;
    @ApiModelProperty(value = "Codelist SUB_DEPARTMENT")
    private List<String> subDepartments;
    @ApiModelProperty(value = "Codelist THIRD_PARTY")
    private String commonExternalProcessResponsible;
    @Singular
    private List<String> productTeams;
    @Singular
    @ApiModelProperty(value = "Codelist SYSTEM")
    private List<String> products;
    @ApiModelProperty(dataType = LOCAL_DATE, example = ORIG_START)
    private String start;
    @ApiModelProperty(dataType = LOCAL_DATE, example = DEFAULT_END)
    private String end;
    private List<LegalBasisRequest> legalBases;

    private boolean usesAllInformationTypes;
    private Boolean automaticProcessing;
    private Boolean profiling;
    private DataProcessingRequest dataProcessing;
    private RetentionRequest retention;
    private DpiaRequest dpia;
    @ApiModelProperty(allowableValues = "IN_PROGRESS, COMPLETED")
    private String status;

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
        setSubDepartments(formatListToUppercase(getSubDepartments()));
        setCommonExternalProcessResponsible(toUpperCaseAndTrim(getCommonExternalProcessResponsible()));
        setDescription(trimToNull(getDescription()));
        setProductTeams(formatList(getProductTeams()));
        setProducts(formatListToUppercase(getProducts()));

        if (getDataProcessing() == null) {
            setDataProcessing(new DataProcessingRequest());
        }
        if (getRetention() == null) {
            setRetention(new RetentionRequest());
        }
        if (getDpia() == null) {
            setDpia(new DpiaRequest());
        }
        if (StringUtils.isBlank(status)) {
            setStatus(ProcessStatus.IN_PROGRESS.name());
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, name);
        validator.checkRequiredCodelist(Fields.purposeCode, purposeCode, ListName.PURPOSE);
        validator.checkCodelist(Fields.department, department, ListName.DEPARTMENT);
        subDepartments.forEach(sd -> validator.checkCodelist(Fields.subDepartments, sd, ListName.SUB_DEPARTMENT));
        validator.checkCodelist(Fields.commonExternalProcessResponsible, commonExternalProcessResponsible, ListName.THIRD_PARTY);
        products.forEach(product -> validator.checkCodelist(Fields.products, product, ListName.SYSTEM));
        validator.checkDate(Fields.start, start);
        validator.checkDate(Fields.end, end);
        validator.validateType(Fields.legalBases, legalBases);
        validator.checkRequiredEnum(Fields.status, status, ProcessStatus.class);

        validator.validateType(Fields.dataProcessing, dataProcessing);
        validator.validateType(Fields.retention, retention);
        validator.validateType(Fields.dpia, dpia);
    }

}
