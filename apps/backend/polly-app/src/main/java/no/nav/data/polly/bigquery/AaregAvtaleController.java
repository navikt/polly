package no.nav.data.polly.bigquery;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.bigquery.domain.PollyAaregAvtale;
import no.nav.data.polly.bigquery.dto.AaregAvtaleResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

import static no.nav.data.common.utils.StreamUtils.convert;

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
        Optional<AaregAvtaleResponse> aaregAvtaleResponse = aaregAvtaleService.getAaregAvtale(id).map(PollyAaregAvtale::toResponse);
        if (aaregAvtaleResponse.isEmpty()) {
            log.info("Cannot find the AAREG avtale with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned AAREG avtale");
        return new ResponseEntity<>(aaregAvtaleResponse.get(), HttpStatus.OK);
    }

    @Operation(summary = "Search AAREG avtale")
    @ApiResponse(description = "Search AAREG avtale")
    @GetMapping("/search/{searchParam}")
    public ResponseEntity<RestResponsePage<AaregAvtaleResponse>> searchAareg(@PathVariable String searchParam) {
        log.info("Received request for AAREG avtale with the searchParam={}", searchParam);
        if (searchParam.length() < 3) {
            throw new ValidationException("Search parameter must be at least 3 characters");
        }
        List<PollyAaregAvtale> pollyAaregAvtaleList = aaregAvtaleService.searchAaregAvtale(searchParam);
        log.info("Returned AAREG avtale");
//        pollyAaregAvtaleList.sort(comparing(paa->paa.getVirksomhet()+paa.getId(),startsWith(searchParam)));
        log.info("Returned {} Aareg avtale", pollyAaregAvtaleList.size());

        return new ResponseEntity<>(new RestResponsePage<>(convert(pollyAaregAvtaleList,PollyAaregAvtale::toResponse)), HttpStatus.OK);
    }
}
