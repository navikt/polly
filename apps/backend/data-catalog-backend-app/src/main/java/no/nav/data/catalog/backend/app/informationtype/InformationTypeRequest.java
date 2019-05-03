package no.nav.data.catalog.backend.app.informationtype;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.github.domain.GithubFile;
import org.apache.tomcat.util.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class InformationTypeRequest {

	private static final Logger logger = LoggerFactory.getLogger(InformationTypeRequest.class);

	private String name;
	private String category;
	private String producer;
	private String system;
	private String description;
	private Boolean personalData;

	public List<InformationTypeRequest> convertFromGithubFile(GithubFile file) {
		byte[] content = null;
		if (file != null && "file".equals(file.getType())) {
			if ("base64".equals(file.getEncoding())) {
				content = Base64.decodeBase64(file.getContent().getBytes());
			}
		}

		if (content != null && content.length > 0) {
			ObjectMapper mapper = new ObjectMapper();
			String jsonString = new String(content, StandardCharsets.UTF_8).trim();

			// make array
			if (!jsonString.startsWith("[")) {
				jsonString = "[" + jsonString + "]";
			}
			try {
				return mapper.readValue(jsonString, new TypeReference<List<InformationTypeRequest>>() {});
			} catch (IOException e) {
				log.error(String.format("Error occurred during parse of Json in file %s from github ", file.getName()), e);
				throw new DataCatalogBackendTechnicalException(String.format("Error occurred during parse of Json in file %s from github ", file.getName()), e);
			}
		}

		return null;
	}

}
