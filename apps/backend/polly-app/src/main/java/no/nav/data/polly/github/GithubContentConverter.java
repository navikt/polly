package no.nav.data.polly.github;

import com.fasterxml.jackson.core.type.TypeReference;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.PollyTechnicalException;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.informationtype.domain.InformationTypeRequest;
import org.apache.tomcat.util.codec.binary.Base64;
import org.eclipse.egit.github.core.RepositoryContents;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import static org.eclipse.egit.github.core.RepositoryContents.ENCODING_BASE64;
import static org.eclipse.egit.github.core.RepositoryContents.TYPE_FILE;

@Slf4j
public class GithubContentConverter {

    public static List<InformationTypeRequest> convertFromGithubFile(RepositoryContents file) {
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
                List<InformationTypeRequest> requests = JsonUtils.readValue(jsonString, new TypeReference<>() {
                });
                AtomicInteger i = new AtomicInteger(0);
                requests.forEach(request -> request.setGithubReference(new GithubReference(request.getName(), file.getPath(), i
                        .incrementAndGet())));
                return requests;
            } catch (IOException e) {
                String error = String.format("Error occurred during parse of Json in file %s from github ", file.getPath());
                log.error(error, e);
                throw new PollyTechnicalException(error, e);
            }
        }

        return Collections.emptyList();
    }
}
