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
    @ApiModelProperty(value = "Codelist", example = "CODELIST")
    private String sensitivity;
    @ApiModelProperty(value = "Codelist", example = "CODELIST")
    private String navMaster;
    @ApiModelProperty(value = "Codelist", example = "[\"CODELIST\"]")
    private List<String> categories;
    @ApiModelProperty(value = "Codelist", example = "[\"CODELIST\"]")
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
        setCategories(nullToEmptyList(categories).stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .collect(Collectors.toList()));
        setSources(nullToEmptyList(sources).stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .collect(Collectors.toList()));
        setSensitivity(toUpperCaseAndTrim(getSensitivity()));
        setNavMaster(toUpperCaseAndTrim(getNavMaster()));
        if (StringUtils.isBlank(term)) {
            setTerm(null);
        }
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
        validator.checkBlank(Fields.description, getDescription());

        validator.checkCodelists(Fields.categories, getCategories(), ListName.CATEGORY);
        validator.checkCodelists(Fields.sources, getSources(), ListName.SOURCE);
        validator.checkRequiredCodelist(Fields.sensitivity, getSensitivity(), ListName.SENSITIVITY);
        validator.checkCodelist(Fields.navMaster, getNavMaster(), ListName.SYSTEM);
    }
}
