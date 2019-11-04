package no.nav.data.polly.process.dto;

import io.swagger.annotations.ApiParam;
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

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class ProcessRequest implements RequestElement {

    private String id;
    private String name;
    @ApiParam(value = "Codelist")
    private String purposeCode;
    @ApiParam(format = "date")
    private String start;
    @ApiParam(format = "date")
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
