package no.nav.data.polly.policy.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.utils.StringUtils;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.dto.LegalBasisRequest;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.common.utils.StringUtils.formatListToUppercase;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldNameConstants
public class PolicyRequest implements RequestElement {

    private String id;
    private String processId;
    @Singular
    @ApiModelProperty(value = "Codelist PURPOSE")
    private List<String> purposes;
    @Singular
    @ApiModelProperty(value = "Codelist SUBJECT_CATEGORY")
    private List<String> subjectCategories;
    private String informationTypeId;
    private boolean legalBasesInherited;
    private LegalBasesUse legalBasesUse;
    private List<LegalBasisRequest> legalBases;
    private List<String> documentIds;

    private int requestIndex;
    private boolean update;

    @JsonIgnore
    private InformationType informationType;
    @JsonIgnore
    private Process process;
    @JsonIgnore
    private Policy existingPolicy;

    @Override
    public String getIdentifyingFields() {
        return processId + "-" + purposes + "-" + subjectCategories + "-" + informationTypeId;
    }

    @JsonIgnore
    @Override
    public String getReference() {
        return getInformationTypeId() + "/" + getPurposes();
    }

    @Override
    public void format() {
        setPurposes(formatListToUppercase(getPurposes()));
        setSubjectCategories(convert(getSubjectCategories(), StringUtils::toUpperCaseAndTrim));
        setDocumentIds(nullToEmptyList(documentIds));
        if (legalBasesUse == null) {
            if (legalBasesInherited) {
                setLegalBasesUse(LegalBasesUse.INHERITED_FROM_PROCESS);
            } else {
                setLegalBasesUse(CollectionUtils.isEmpty(legalBases) ? LegalBasesUse.UNRESOLVED : LegalBasesUse.DEDICATED_LEGAL_BASES);
            }
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkRequiredCodelists(Fields.purposes, purposes, ListName.PURPOSE);
        validator.checkBlank(Fields.informationTypeId, informationTypeId);
        validator.checkUUID(Fields.informationTypeId, informationTypeId);
        validator.checkBlank(Fields.processId, processId);
        validator.checkUUID(Fields.processId, processId);
        validator.checkRequiredCodelists(Fields.subjectCategories, subjectCategories, ListName.SUBJECT_CATEGORY);
        validator.validateType(Fields.legalBases, legalBases);
        validator.checkId(this);
        documentIds.forEach(docId -> validator.checkUUID(Fields.documentIds, docId));
    }

    public UUID getInformationTypeIdAsUUID() {
        try {
            return informationTypeId == null ? null : UUID.fromString(informationTypeId);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public UUID getProcessIdAsUUID() {
        try {
            return processId == null ? null : UUID.fromString(processId);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
