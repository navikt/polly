package no.nav.data.polly.informationtype.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldNameConstants;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.github.GithubReference;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeMaster;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.REST;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldNameConstants
public class InformationTypeRequest implements RequestElement {

    private String term;
    private String name;
    private String context;
    private String description;
    private String pii;
    private String sensitivity;
    private List<String> categories;
    private List<String> sources;
    private List<String> keywords;

    private boolean update;
    private int requestIndex;

    @JsonIgnore
    private InformationTypeMaster informationTypeMaster;
    @JsonIgnore
    private GithubReference githubReference;

    @Override
    public String getIdentifyingFields() {
        return name + "-" + context;
    }

    @Override
    public String getReference() {
        switch (informationTypeMaster) {
            case GITHUB:
                return getRequestReference().orElse("");
            case REST:
                return "Request:" + requestIndex;
            case KAFKA:
                return "Kafka";
            default:
                throw new IllegalStateException("Unexpected value: " + informationTypeMaster);
        }
    }

    public void format() {
        setCategories(nullToEmptyList(categories).stream()
                .map(String::trim)
                .collect(Collectors.toList()));
        setSources(nullToEmptyList(sources).stream()
                .map(String::trim)
                .collect(Collectors.toList()));
    }

    public static void initiateRequests(List<InformationTypeRequest> requests, boolean update, InformationTypeMaster master) {
        requests.forEach(informationTypeRequest -> {
            informationTypeRequest.setInformationTypeMaster(master);
            informationTypeRequest.setUpdate(update);
        });
        if (master == REST) {
            assignIds(requests);
        }
    }

    public static void assignIds(List<InformationTypeRequest> requests) {
        AtomicInteger requestIndex = new AtomicInteger(1);
        requests.forEach(request -> request.setRequestIndex(requestIndex.getAndIncrement()));
    }

    public void assertMaster(InformationType informationType) {
        if (getInformationTypeMaster() != informationType.getData().getInformationTypeMaster()) {
            throw new ValidationException(
                    String.format("Master mismatch for update, informationType is mastered by=%s request came from %s", informationType.getData().getInformationTypeMaster(),
                            getInformationTypeMaster()));
        }
    }

    @Override
    public void validate(FieldValidator validator) {
        validator.checkBlank(Fields.term, getTerm());
        validator.checkBlank(Fields.name, getName());
        validator.checkBlank(Fields.context, getContext());
        validator.checkBlank(Fields.description, getDescription());

        validator.checkCodelists(Fields.categories, getCategories(), ListName.CATEGORY);
        validator.checkCodelists(Fields.sources, getSources(), ListName.SOURCE);
    }

    @JsonIgnore
    private Optional<String> getRequestReference() {
        return githubReference == null ? Optional.empty() : Optional.ofNullable(githubReference.toString());
    }
}
