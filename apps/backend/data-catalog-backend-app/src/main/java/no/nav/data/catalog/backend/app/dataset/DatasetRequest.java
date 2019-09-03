package no.nav.data.catalog.backend.app.dataset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.common.validator.RequestElement;
import no.nav.data.catalog.backend.app.github.GithubReference;
import org.apache.tomcat.util.codec.binary.Base64;
import org.eclipse.egit.github.core.RepositoryContents;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.nullToEmptyString;
import static org.eclipse.egit.github.core.RepositoryContents.ENCODING_BASE64;
import static org.eclipse.egit.github.core.RepositoryContents.TYPE_FILE;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DatasetRequest implements RequestElement {

    private String title;
    private String description;
    private List<String> categories;
    private List<String> provenances;
    private String pi;
    private String issued;
    private List<String> keywords;
    private String theme;
    private String accessRights;
    private String publisher;
    private String spatial;
    private List<String> haspart;
    private List<String> distributionChannels;

    @JsonIgnore
    private GithubReference githubReference;

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
                throw new DataCatalogBackendTechnicalException(error, e);
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

    String getReference(DatasetMaster master, String requestIndex) {
        switch (master) {
            case GITHUB:
                return getRequestReference().orElse("");
            case REST:
                return "Request:" + requestIndex;
            case KAFKA:
                return "Kafka";
            default:
                throw new IllegalStateException("Unexpected value: " + master);
        }
    }

    void toUpperCaseAndTrim() {
        setTitle(nullToEmptyString(title).toUpperCase().trim());
        setDescription(nullToEmptyString(description).toUpperCase().trim());
        setCategories(nullToEmptyList(categories).stream()
                .map(String::toUpperCase)
                .map(String::trim)
                .collect(Collectors.toList()));
        setProvenances(nullToEmptyList(provenances).stream()
                .map(String::toUpperCase)
                .map(String::trim)
                .collect(Collectors.toList()));
        setPi(nullToEmptyString(pi).trim());
        setIssued(nullToEmptyString(issued).trim());
        setKeywords(nullToEmptyList(keywords).stream().map(String::toUpperCase).map(String::trim).collect(Collectors.toList()));
        setTheme(nullToEmptyString(theme).toUpperCase().trim());
        setAccessRights(nullToEmptyString(accessRights).toUpperCase().trim());
        setPublisher(nullToEmptyString(publisher).toUpperCase().trim());
        setSpatial(nullToEmptyString(spatial).toUpperCase().trim());
        setHaspart(nullToEmptyList(haspart).stream().map(String::trim).collect(Collectors.toList()));
        setDistributionChannels(nullToEmptyList(distributionChannels).stream()
                .map(String::toUpperCase)
                .map(String::trim)
                .collect(Collectors.toList()));
    }
}
