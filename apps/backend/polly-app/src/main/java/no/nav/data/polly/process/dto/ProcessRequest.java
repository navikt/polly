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
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.regex.Pattern;

import static no.nav.data.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.common.utils.DateUtil.ORIG_START;
import static no.nav.data.common.utils.StringUtils.formatList;
import static no.nav.data.common.utils.StringUtils.formatListToUppercase;
import static no.nav.data.common.utils.StringUtils.toUpperCaseAndTrim;
import static org.apache.commons.lang3.StringUtils.trimToNull;
import static org.apache.commons.lang3.StringUtils.upperCase;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class ProcessRequest implements RequestElement {

    public static final Pattern NAV_IDENT_PATTERN = Pattern.compile("[A-Z][0-9]{6}");

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

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldNameConstants
    public static class DataProcessingRequest {

        private Boolean dataProcessor;
        private List<String> dataProcessorAgreements;
        private Boolean dataProcessorOutsideEU;
        @ApiModelProperty(value = "Codelist TRANSFER_GROUNDS_OUTSIDE_EU")
        private String transferGroundsOutsideEU;
        private String transferGroundsOutsideEUOther;
        private List<String> transferCountries;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RetentionRequest {

        private Boolean retentionPlan;
        private Integer retentionMonths;
        private String retentionStart;
        private String retentionDescription;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldNameConstants
    public static class DpiaRequest {

        private Boolean needForDpia;
        private String refToDpia;
        private String grounds;
        private boolean processImplemented;
        private String riskOwner;
        private String riskOwnerFunction;
    }

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

        formatDataProcessing();
        formatRetention();
        formatDpia();
        if (StringUtils.isBlank(status)) {
            setStatus(ProcessStatus.IN_PROGRESS.name());
        }
    }

    private void formatDataProcessing() {
        if (getDataProcessing() == null) {
            setDataProcessing(new DataProcessingRequest());
        }
        var dp = getDataProcessing();
        dp.setDataProcessorAgreements(formatList(dp.getDataProcessorAgreements()));
        if (Boolean.FALSE.equals(dp.getDataProcessor())) {
            dp.setDataProcessorAgreements(List.of());
            dp.setDataProcessorOutsideEU(null);
        }
        if (!Boolean.TRUE.equals(dp.getDataProcessorOutsideEU())) {
            dp.setTransferGroundsOutsideEU(null);
            dp.setTransferGroundsOutsideEUOther(null);
            dp.setTransferCountries(List.of());
        } else {
            dp.setTransferGroundsOutsideEU(toUpperCaseAndTrim(dp.getTransferGroundsOutsideEU()));
            dp.setTransferGroundsOutsideEUOther(trimToNull(dp.getTransferGroundsOutsideEUOther()));
            dp.setTransferCountries(formatList(dp.getTransferCountries()));
        }
    }

    private void formatRetention() {
        if (getRetention() == null) {
            setRetention(new RetentionRequest());
        }
        var r = getRetention();
        r.setRetentionStart(trimToNull(r.getRetentionStart()));
        r.setRetentionDescription(trimToNull(r.getRetentionDescription()));
    }

    private void formatDpia() {
        if (getDpia() == null) {
            setDpia(new DpiaRequest());
        }
        var d = getDpia();
        d.setGrounds(trimToNull(d.getGrounds()));
        d.setRefToDpia(trimToNull(d.getRefToDpia()));
        d.setRiskOwner(upperCase(trimToNull(d.getRiskOwner())));
        d.setRiskOwnerFunction(trimToNull(d.getRiskOwnerFunction()));
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
        validator.checkPattern(Fields.dpia + "." + DpiaRequest.Fields.riskOwner, dpia.riskOwner, NAV_IDENT_PATTERN);
        if (Boolean.TRUE.equals(dataProcessing.getDataProcessorOutsideEU())) {
            validator.checkRequiredCodelist(DataProcessingRequest.Fields.transferGroundsOutsideEU, dataProcessing.transferGroundsOutsideEU, ListName.TRANSFER_GROUNDS_OUTSIDE_EU);
        }
    }

}
