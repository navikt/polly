package no.nav.data.polly.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DocumentRequest implements RequestElement {

    private String id;
    private String name;
    private String description;
    private List<String> informationTypeIds;

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
        setInformationTypeIds(StreamUtils.safeStream(informationTypeIds).map(StringUtils::trimToNull).filter(StringUtils::isNotBlank).collect(Collectors.toList()));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, name);
        validator.checkBlank(Fields.description, name);
        informationTypeIds.forEach(it -> validator.checkUUID(Fields.informationTypeIds, it));
    }
}
