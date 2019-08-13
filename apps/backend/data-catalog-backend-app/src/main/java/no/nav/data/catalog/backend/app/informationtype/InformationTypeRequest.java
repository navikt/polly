package no.nav.data.catalog.backend.app.informationtype;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
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

import static org.eclipse.egit.github.core.RepositoryContents.ENCODING_BASE64;
import static org.eclipse.egit.github.core.RepositoryContents.TYPE_FILE;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class InformationTypeRequest {

    private String name;
    private String categoryCode;
    private List<String> producerCode;
    private String systemCode;
    private String description;
    private Boolean personalData;

    private GithubReference githubReference;

    public static List<InformationTypeRequest> convertFromGithubFile(RepositoryContents file) {
        byte[] content = null;
        if (file != null && TYPE_FILE.equals(file.getType()) && ENCODING_BASE64.equals(file.getEncoding())) {
            content = Base64.decodeBase64(file.getContent().getBytes());
        }

        if (content != null && content.length > 0) {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = new String(content, StandardCharsets.UTF_8).trim();

            // make array
            if (!jsonString.startsWith("[")) {
                jsonString = "[" + jsonString + "]";
            }
            try {
                List<InformationTypeRequest> informationTypeRequests = mapper.readValue(jsonString, new TypeReference<List<InformationTypeRequest>>() {
                });
                AtomicInteger i = new AtomicInteger(0);
                informationTypeRequests.forEach(informationTypeRequest -> {
                    informationTypeRequest.setGithubReference(new GithubReference(informationTypeRequest.getName(), file.getPath(), i.incrementAndGet()));
                });
                return informationTypeRequests;
            } catch (IOException e) {
                log.error(String.format("Error occurred during parse of Json in file %s from github ", file.getName()), e);
                throw new DataCatalogBackendTechnicalException(String.format("Error occurred during parse of Json in file %s from github ", file.getName()), e);
            }
        }

        return Collections.emptyList();
    }

    @JsonIgnore
    public Optional<String> getRequestReference() {
        return githubReference == null ? Optional.empty() : Optional.ofNullable(githubReference.toString());
    }

    public void toUpperCaseAndTrim() {
        setName(this.name.trim());
        setDescription(this.description.trim());
        setCategoryCode(this.categoryCode.toUpperCase().trim());
        setSystemCode(this.systemCode.toUpperCase().trim());
        setProducerCode(this.producerCode.stream()
                .map(p -> p.toUpperCase().trim())
                .collect(Collectors.toList()));
    }

}
