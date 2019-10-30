package no.nav.data.polly.process.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
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
    private String purposeCode;
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
        validator.checkCodelist(Fields.purposeCode, purposeCode, ListName.PURPOSE);
    }

    public Process convertToProcess() {
        return Process.builder()
                .generateId()
                .name(name)
                .purposeCode(purposeCode)
                .legalBases(convert(legalBases, LegalBasisRequest::convertToLegalBasis))
                .build();
    }
}
