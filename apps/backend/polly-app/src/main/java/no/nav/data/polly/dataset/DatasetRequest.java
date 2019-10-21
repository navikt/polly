package no.nav.data.polly.dataset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.ListName;
import no.nav.data.polly.common.exceptions.PollyTechnicalException;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.common.validator.FieldValidator;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.github.GithubReference;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.eclipse.egit.github.core.RepositoryContents;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;
import static no.nav.data.polly.common.utils.StringUtils.ifNotNullToUppercaseAndTrim;
import static org.eclipse.egit.github.core.RepositoryContents.ENCODING_BASE64;
import static org.eclipse.egit.github.core.RepositoryContents.TYPE_FILE;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DatasetRequest implements RequestElement {

    private String contentType;
    private String title;
    private String description;
    private List<String> categories;
    private List<String> provenances;
    private String pi;
    private List<String> keywords;
    private List<String> themes;
    private String accessRights;
    private String spatial;
    private List<String> haspart;

    private String issued;
    private String publisher;

    @JsonIgnore
    private GithubReference githubReference;
    @JsonIgnore
    private boolean update;
    @JsonIgnore
    private int requestIndex;
    @JsonIgnore
    private DatacatalogMaster datacatalogMaster;

    public static List<DatasetRequest> convertFromGithubFile(RepositoryContents file) {
        byte[] content = null;
        if (file != null && TYPE_FILE.equals(file.getType()) && ENCODING_BASE64.equals(file.getEncoding())) {
            content = Base64.decodeBase64(file.getContent().getBytes());
        }

        if (content != null && content.length > 0) {
            String jsonString = new String(content, StandardCharsets.UTF_8).trim();

            // make array
            if (!jsonString.startsWith("[")) {
                jsonString = "[" + jsonString + "]";
            }
            try {
                List<DatasetRequest> datasetRequests = JsonUtils.readValue(jsonString, new TypeReference<>() {
                });
                AtomicInteger i = new AtomicInteger(0);
                datasetRequests.forEach(request -> request.setGithubReference(new GithubReference(request.getTitle(), file.getPath(), i
                        .incrementAndGet())));
                return datasetRequests;
            } catch (IOException e) {
                String error = String.format("Error occurred during parse of Json in file %s from github ", file.getPath());
                log.error(error, e);
                throw new PollyTechnicalException(error, e);
            }
        }

        return Collections.emptyList();
    }

    @JsonIgnore
    private Optional<String> getRequestReference() {
        return githubReference == null ? Optional.empty() : Optional.ofNullable(githubReference.toString());
    }

    @Override
    public String getIdentifyingFields() {
        return title;
    }

    @Override
    public String getRequestType() {
        return "dataset";
    }

    @Override
    public String getReference() {
        switch (datacatalogMaster) {
            case GITHUB:
                return getRequestReference().orElse("");
            case REST:
                return "Request:" + requestIndex;
            case KAFKA:
                return "Kafka";
            default:
                throw new IllegalStateException("Unexpected value: " + datacatalogMaster);
        }
    }

    void toUpperCaseAndTrim() {
        setContentType(ifNotNullToUppercaseAndTrim(contentType));
        setCategories(nullToEmptyList(categories).stream()
                .map(String::toUpperCase)
                .map(String::trim)
                .collect(Collectors.toList()));
        setProvenances(nullToEmptyList(provenances).stream()
                .map(String::toUpperCase)
                .map(String::trim)
                .collect(Collectors.toList()));

        // TODO sjekk
//        doUpperCaseAndTrim();
    }

    void doUpperCaseAndTrim() {
        setTitle(ifNotNullToUppercaseAndTrim(title));
        setDescription(ifNotNullToUppercaseAndTrim(description));
        setProvenances(nullToEmptyList(provenances).stream()
                .map(String::toUpperCase)
                .map(String::trim)
                .collect(Collectors.toList()));
        setPi(StringUtils.trim(pi));
        setIssued(StringUtils.trim(issued));
        setKeywords(nullToEmptyList(keywords).stream().map(String::toUpperCase).map(String::trim).collect(Collectors.toList()));
        setThemes(nullToEmptyList(themes));
        setAccessRights(ifNotNullToUppercaseAndTrim(accessRights));
        setPublisher(ifNotNullToUppercaseAndTrim(publisher));
        setSpatial(ifNotNullToUppercaseAndTrim(spatial));
        setHaspart(nullToEmptyList(haspart).stream().map(String::toUpperCase).map(String::trim).collect(Collectors.toList()));
//        setDistributionChannels(nullToEmptyList(distributionChannels).stream()
//                .map(String::toUpperCase)
//                .map(String::trim)
//                .collect(Collectors.toList()));
    }

    public static void initiateRequests(List<DatasetRequest> requests, boolean update, DatacatalogMaster master) {
        requests.forEach(datasetRequest -> {
            datasetRequest.setDatacatalogMaster(master);
            datasetRequest.setUpdate(update);
        });
        if (master == DatacatalogMaster.REST) {
            assignIds(requests);
        }
    }

    public static void assignIds(List<DatasetRequest> requests) {
        AtomicInteger requestIndex = new AtomicInteger(1);
        requests.forEach(request -> request.setRequestIndex(requestIndex.getAndIncrement()));
    }

    public void assertMaster(Dataset dataset) {
        if (getDatacatalogMaster() != dataset.getDatasetData().getDatacatalogMaster()) {
            throw new ValidationException(
                    String.format("Master mismatch for update, dataset is mastered by=%s request came from %s", dataset.getDatasetData().getDatacatalogMaster(),
                            getDatacatalogMaster()));
        }
    }

    @Override
    public FieldValidator validateFields() {
        FieldValidator validator = new FieldValidator(getReference());

        validator.checkEnum("contentType", getContentType(), ContentType.class);
        validator.checkBlank("title", getTitle());

        safeStream(getCategories()).forEach(category -> validator.checkCodelist("categories", category, ListName.CATEGORY));
        safeStream(getProvenances()).forEach(provenance -> validator.checkCodelist("provenances", provenance, ListName.PROVENANCE));

        // TODO: Find out which fields should be validated
//        validator.checkField("description", request.getDescription());
//        validator.checkListOfFields("categories", request.getCategories());
//        validator.checkListOfFields("provenances", request.getProvenances());
//        validator.checkField("pi", request.getPi());
//        validator.checkField("issued", request.getIssued());
//        validator.checkListOfFields("keywords", request.getKeywords());
//        validator.checkField("theme", request.getTheme());
//        validator.checkField("accessRights", request.getAccessRights());
//        validator.checkField("publisher", request.getPublisher());
//        validator.checkField("spatial", request.getSpatial());
//        validator.checkField("haspart", request.getHaspart());
//        validator.checkListOfFields("distributionChannels", request.getDistributionChannels());

        return validator;
    }
}
