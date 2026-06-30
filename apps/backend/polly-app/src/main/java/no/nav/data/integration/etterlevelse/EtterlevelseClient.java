package no.nav.data.integration.etterlevelse;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.integration.etterlevelse.domain.PvkDokumentShort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
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
    private EtterlevelseClientProperties properties;

    public List<PvkDokumentShort> getPvkDokumentForBehandling(UUID behandlingId) {
        List<PvkDokumentShort> pvkDokumentShorts = new ArrayList<>();
        try {
            log.info("Getting pvk dokument for behandling {} from etterlevelsesløsning", behandlingId);
            var response = restTemplate.exchange(properties.getUrl() + "/pvkdokument/behandling/" + behandlingId, HttpMethod.GET, null, new ParameterizedTypeReference<List<PvkDokumentShort>>() {});

            if(response.getBody() != null) {
                log.info("Succesfully got request from etterlevelsesløsning");
                return response.getBody();
            }
        } catch (RestClientException e) {
            log.error("Unable to connect to Etterlevelse løsning, error: {}", String.valueOf(e));
        }
        return pvkDokumentShorts;
    }
}
