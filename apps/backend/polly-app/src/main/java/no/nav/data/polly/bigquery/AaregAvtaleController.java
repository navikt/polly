package no.nav.data.polly.bigquery;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.bigquery.domain.AaregAvtale;
import no.nav.data.polly.bigquery.dto.AaregAvtaleResponse;
import no.nav.data.polly.term.domain.PollyTerm;
import no.nav.data.polly.term.dto.TermResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/aaregavtale")
@Tag(name = "Aareg", description = "REST API for AAREG avtale")
public class AaregAvtaleController {
    private final AaregAvtaleService aaregAvtaleService;

    public AaregAvtaleController(AaregAvtaleService aaregAvtaleService) {
        this.aaregAvtaleService = aaregAvtaleService;
    }

    @Operation(summary = "Get AAREG avtale")
    @ApiResponse(description = "AAREG avtale fetched")
    @GetMapping("/{id}")
    public ResponseEntity<AaregAvtaleResponse> findForId(@PathVariable String id) {
        log.info("Received request for AAREG avtale with the id={}", id);
        Optional<AaregAvtaleResponse> aaregAvtaleResponse = aaregAvtaleService.getAaregAvtale(id).map(AaregAvtale::toResponse);
        if (aaregAvtaleResponse.isEmpty()) {
            log.info("Cannot find the AAREG avtale with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned AAREG avtale");
        return new ResponseEntity<>(aaregAvtaleResponse.get(), HttpStatus.OK);
    }
}
