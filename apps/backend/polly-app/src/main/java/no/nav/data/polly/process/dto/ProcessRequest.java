package no.nav.data.polly.process.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.process.domain.Process;

import java.util.List;

import static no.nav.data.polly.common.swagger.SwaggerConfig.LOCAL_DATE;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_END;
import static no.nav.data.polly.common.utils.DateUtil.DEFAULT_START;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
@JsonPropertyOrder({"id,", "name", "purposeCode", "start", "end", "legalBases"})
public class ProcessRequest implements RequestElement {

    private String id;
    private String name;
    @ApiModelProperty(value = "Codelist")
    private String purposeCode;
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
    public void validate(FieldValidator validator) {
        validator.checkBlank(Fields.name, name);
        validator.checkRequiredCodelist(Fields.purposeCode, purposeCode, ListName.PURPOSE);
        validator.checkDate(Fields.start, start);
        validator.checkDate(Fields.end, end);
        validator.validateType(Fields.legalBases, legalBases);
    }

    public Process convertToProcess() {
        return Process.builder()
                .generateId()
                .name(name)
                .purposeCode(purposeCode)
                .start(DateUtil.parseStart(start))
                .end(DateUtil.parseEnd(end))
                .legalBases(convert(legalBases, LegalBasisRequest::convertToLegalBasis))
                .build();
    }
}
