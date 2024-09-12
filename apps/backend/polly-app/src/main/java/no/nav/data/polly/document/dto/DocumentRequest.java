package no.nav.data.polly.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.common.validator.FieldValidator;
import no.nav.data.common.validator.RequestElement;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentData;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.convert;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DocumentRequest implements RequestElement {

    private String id;
    private String name;
    private String description;
    private List<DocumentInfoTypeUseRequest> informationTypes;
    private String dataAccessClass;

    private boolean update;
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return getId();
    }

    @Override
    public void format() {
        setName(StringUtils.trimToNull(name));
        setDescription(StringUtils.trimToNull(description));
        setInformationTypes(StreamUtils.nullToEmptyList(informationTypes));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, name);
        validator.checkBlank(Fields.description, name);
        validator.validateType(Fields.informationTypes, informationTypes);
    }
    
    public Document convertToDocument() {
        var db = Document.builder();
        if (id != null) {
            db.id(no.nav.data.common.utils.StringUtils.toUUID(id));
        } else if (!isUpdate()) {
            db.generateId();
        } else {
            throw new IllegalArgumentException("Update request without id of existing Document");
        }
        return db
                .data(DocumentData.builder().description(getDescription()).name(getName())
                        .dataAccessClass(getDataAccessClass())
                        .informationTypes(convert(getInformationTypes(), DocumentData.InformationTypeUse::convertFromRequest))
                        .build())
                .build();
    }

}
