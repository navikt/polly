package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.Policy;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
public class PolicyRequest implements RequestElement {

    private String id;
    private String process;
    private String purposeCode;
    private String subjectCategories;
    private String informationTypeName;
    private String start;
    private String end;
    private List<LegalBasisRequest> legalBases;

    private int requestIndex;
    private boolean update;

    @JsonIgnore
    private InformationType informationType;
    @JsonIgnore
    private Policy existingPolicy;

    @Override
    public String getIdentifyingFields() {
        return process + "-" + purposeCode + "-" + subjectCategories;
    }

    @JsonIgnore
    public String getReference() {
        return getInformationTypeName() + "/" + getPurposeCode();
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkCodelist(Fields.purposeCode, purposeCode, ListName.PURPOSE);
        validator.checkBlank(Fields.informationTypeName, informationTypeName);
        validator.checkBlank(Fields.process, process);
        validator.checkBlank(Fields.subjectCategories, subjectCategories);
    }

}
