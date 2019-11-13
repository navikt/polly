package no.nav.data.polly.informationtype.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import no.nav.data.polly.github.GithubReference;
import org.apache.commons.lang3.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.swagger.SwaggerConfig.BOOLEAN;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;

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
    @ApiModelProperty(dataType = BOOLEAN)
    private String pii;
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

    @JsonIgnore
    private GithubReference githubReference;

    @Override
    public String getIdentifyingFields() {
        return name;
    }

    public void format() {
        setCategories(nullToEmptyList(categories).stream()
                .map(String::trim)
                .collect(Collectors.toList()));
        setSources(nullToEmptyList(sources).stream()
                .map(String::trim)
                .collect(Collectors.toList()));
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
        validator.checkRequiredCodelist(Fields.navMaster, getNavMaster(), ListName.SYSTEM);
    }

    @JsonIgnore
    private Optional<String> getRequestReference() {
        return githubReference == null ? Optional.empty() : Optional.ofNullable(githubReference.toString());
    }
}
