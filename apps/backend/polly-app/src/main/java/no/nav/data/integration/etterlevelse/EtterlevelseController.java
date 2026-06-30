package no.nav.data.integration.etterlevelse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.integration.etterlevelse.domain.PvkDokumentShort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/etterlevelse")
@Tag(name = "Etterlevelse", description = "Etterlevelse API")
public class EtterlevelseController {

    private final EtterlevelseClient etterlevelseClient;


    @Operation(summary = "Get pvk dokument for behandling")
    @ApiResponse(description = "ok")
    @GetMapping("/pvkdokument/behandling/{behandlingId}")
    public ResponseEntity<List<PvkDokumentShort>> getPvkDokumentForBehandling(@PathVariable("behandlingId") UUID behandlingId) {
        log.info("Get pvk dokument for behandling {}", behandlingId);
        List<PvkDokumentShort> response = etterlevelseClient.getPvkDokumentForBehandling(behandlingId);
        return ResponseEntity.ok(response);
    }
}
