package no.nav.data.catalog.backend.app.informationtype;

import static org.eclipse.egit.github.core.RepositoryContents.ENCODING_BASE64;
import static org.eclipse.egit.github.core.RepositoryContents.TYPE_FILE;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import org.apache.tomcat.util.codec.binary.Base64;
import org.eclipse.egit.github.core.RepositoryContents;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class InformationTypeRequest {

    private static final Logger logger = LoggerFactory.getLogger(InformationTypeRequest.class);

    private String name;
    private String categoryCode;
    private List<String> producerCode;
    private String systemCode;
    private String description;
    private Boolean personalData;

    private String githubFile;
    private Integer githubFileOrdinal;

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
                    informationTypeRequest.setGithubFile(file.getPath());
                    informationTypeRequest.setGithubFileOrdinal(i.incrementAndGet());
                });
                return informationTypeRequests;
            } catch (IOException e) {
                logger.error(String.format("Error occurred during parse of Json in file %s from github ", file.getName()), e);
                throw new DataCatalogBackendTechnicalException(String.format("Error occurred during parse of Json in file %s from github ", file.getName()), e);
            }
        }

        return Collections.emptyList();
    }

    @JsonIgnore
    public Optional<String> getRequestReference() {
        return githubFile == null ? Optional.empty() : Optional.ofNullable(String.format("name=%s file=%s ordinal=%d", name, githubFile, githubFileOrdinal));
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
