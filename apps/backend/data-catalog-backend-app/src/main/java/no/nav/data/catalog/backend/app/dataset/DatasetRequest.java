package no.nav.data.catalog.backend.app.dataset;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.github.GithubReference;
import org.apache.tomcat.util.codec.binary.Base64;
import org.eclipse.egit.github.core.RepositoryContents;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.eclipse.egit.github.core.RepositoryContents.ENCODING_BASE64;
import static org.eclipse.egit.github.core.RepositoryContents.TYPE_FILE;

@Slf4j
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class DatasetRequest extends DatasetData {

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
                datasetRequests.forEach(request -> {
                    request.setGithubReference(new GithubReference(request.getTitle(), file.getPath(), i.incrementAndGet()));
                    request.setMaster(DatasetMaster.GITHUB);
                });
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
    public Optional<String> getRequestReference() {
        return githubReference == null ? Optional.empty() : Optional.ofNullable(githubReference.toString());
    }
}
