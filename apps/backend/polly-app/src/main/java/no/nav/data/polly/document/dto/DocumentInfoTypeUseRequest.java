package no.nav.data.polly.document.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.Validated;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class DocumentInfoTypeUseRequest implements Validated {

    private String informationTypeId;
    private List<String> subjectCategories;

    @Override
    public void format() {
        setInformationTypeId(StringUtils.trimToNull(informationTypeId));
        setSubjectCategories(StreamUtils.safeStream(subjectCategories).map(StringUtils::trimToNull)
                .filter(StringUtils::isNotBlank)
                .map(String::toUpperCase)
                .collect(Collectors.toList()));
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.informationTypeId, informationTypeId);
        subjectCategories.forEach(subjCat -> validator.checkCodelist(Fields.subjectCategories, subjCat, ListName.SUBJECT_CATEGORY));
    }
}
