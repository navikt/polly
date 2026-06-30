package no.nav.data.integration.etterlevelse;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.integration.etterlevelse.domain.PvkDokumentShort;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;


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
            var response = restTemplate.getForEntity(properties.getUrl() + "/pvkdokument/behandling/" + behandlingId, PvkDokumentShort[].class);

            if(response.getBody() != null) {
                log.info("Succesfully got request from etterlevelsesløsning");
                return Arrays.asList(response.getBody());
            }
        } catch (RestClientException e) {
            log.error("Unable to connect to Etterlevelse løsning, error: {}", String.valueOf(e));
        }
        return pvkDokumentShorts;
    }
}
