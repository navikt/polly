package no.nav.data.polly.informationtype.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;
import static no.nav.data.polly.common.utils.StringUtils.toUpperCaseAndTrim;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class InformationTypeRequest implements RequestElement {

    private String id;
    private String name;
    private String description;
    private String term;
    @ApiModelProperty(value = "Codelist SENSITIVITY")
    private String sensitivity;
    @ApiModelProperty(value = "Codelist SYSTEM")
    private String navMaster;
    @ApiModelProperty(value = "Codelist CATEGORY", example = "[\"CODELIST\"]")
    private List<String> categories;
    @ApiModelProperty(value = "Codelist THIRD_PARTY", example = "[\"CODELIST\"]")
    private List<String> sources;
    private List<String> keywords;

    private boolean update;
    private int requestIndex;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    @Override
    public void format() {
        setName(StringUtils.stripToNull(name));
        setDescription(StringUtils.stripToNull(description));
        setTerm(StringUtils.stripToNull(term));
        setSensitivity(toUpperCaseAndTrim(getSensitivity()));
        setNavMaster(toUpperCaseAndTrim(getNavMaster()));
        setCategories(nullToEmptyList(categories).stream()
                .map(StringUtils::stripToNull)
                .map(String::toUpperCase)
                .collect(Collectors.toList()));
        setSources(nullToEmptyList(sources).stream()
                .map(StringUtils::stripToNull)
                .map(String::toUpperCase)
                .collect(Collectors.toList()));
        setKeywords(safeStream(keywords)
                .map(StringUtils::stripToNull)
                .filter(StringUtils::isNotBlank)
                .collect(Collectors.toList()));
    }

    public static void initiateRequests(List<InformationTypeRequest> requests, boolean update) {
        AtomicInteger requestIndex = new AtomicInteger(1);
        requests.forEach(request -> {
            request.setUpdate(update);
            request.setRequestIndex(requestIndex.getAndIncrement());
        });
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkUUID(Fields.id, id);
        validator.checkId(this);
        validator.checkBlank(Fields.name, getName());

        validator.checkCodelists(Fields.categories, getCategories(), ListName.CATEGORY);
        validator.checkCodelists(Fields.sources, getSources(), ListName.THIRD_PARTY);
        validator.checkRequiredCodelist(Fields.sensitivity, getSensitivity(), ListName.SENSITIVITY);
        validator.checkCodelist(Fields.navMaster, getNavMaster(), ListName.SYSTEM);
    }
}
