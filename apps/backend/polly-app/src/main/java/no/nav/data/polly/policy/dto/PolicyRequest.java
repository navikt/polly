package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.policy.domain.Policy;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
@JsonIgnoreProperties(ignoreUnknown = true)
public class PolicyRequest implements RequestElement {

    private String id;
    private String purposeCode;
    private String informationTypeName;
    private String process;
    private String subjectCategories;
    private List<LegalBasisRequest> legalBases;
    private String start;
    private String end;

    @JsonIgnore
    private int requestIndex;
    @JsonIgnore
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
