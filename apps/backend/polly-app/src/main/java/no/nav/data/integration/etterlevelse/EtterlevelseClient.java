package no.nav.data.integration.etterlevelse;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.integration.etterlevelse.domain.PvkDokumentShort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Slf4j
@Service
@AllArgsConstructor
public class EtterlevelseClient {

    private RestTemplate restTemplate;
    private ObjectMapper objectMapper;
    private EtterlevelseClientProperties properties;

    private static final TypeReference<List<PvkDokumentShort>> PVK_DOKUMENT_SHORT_LIST = new TypeReference<>() {
    };

    public List<PvkDokumentShort> getPvkDokumentForBehandling(UUID behandlingId) {
        List<PvkDokumentShort> pvkDokumentShorts = new ArrayList<>();
        try {
            log.info("Getting pvk dokument for behandling {} from etterlevelsesløsning", behandlingId);
            ResponseEntity<String> response = restTemplate.getForEntity(properties.getUrl() + "/pvkdokument/behandling/" + behandlingId, String.class);
            log.info("Got pvk dokument for behandling {}", response);
            if(response.getBody() != null) {
                log.info("Succesfully got request from etterlevelsesløsning");
                return parsePvkDokumentResponse(response.getBody());
            }
        } catch (RestClientException | JsonProcessingException e) {
            log.error("Unable to connect to Etterlevelse løsning, error: {}", String.valueOf(e));
        }
        return pvkDokumentShorts;
    }

    private List<PvkDokumentShort> parsePvkDokumentResponse(String body) throws JsonProcessingException {
        JsonNode json = objectMapper.readTree(body);
        if (json.isArray()) {
            return objectMapper.convertValue(json, PVK_DOKUMENT_SHORT_LIST);
        }
        log.warn("Unexpected response format from etterlevelsesløsning: {}", body);
        return List.of();
    }
}
