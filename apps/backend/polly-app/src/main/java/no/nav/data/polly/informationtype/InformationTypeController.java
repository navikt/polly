package no.nav.data.polly.informationtype;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.ValidationException;
import no.nav.data.common.rest.PageParameters;
import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.informationtype.dto.InformationTypeResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import no.nav.data.polly.teams.TeamService;
import no.nav.data.polly.teams.domain.Team;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static no.nav.data.common.utils.StartsWithComparator.startsWith;
import static no.nav.data.common.utils.StreamUtils.convert;

@Slf4j
@RestController
@RequestMapping("/informationtype")
@Tag(name = "InformationType", description = "REST API for InformationType")
public class InformationTypeController {

    // TODO: Implementerer ikke controller → service → DB. Flytt all forretningslogikk, *Repository-aksess og @Transactional til tjenestelaget.
    
    private final InformationTypeRepository repository;
    private final InformationTypeService service;
    private final TeamService teamService;

    public InformationTypeController(InformationTypeRepository informationTypeRepository,
            InformationTypeService informationTypeService, TeamService teamService) {
        this.repository = informationTypeRepository;
        this.service = informationTypeService;
        this.teamService = teamService;
    }

    @Operation(summary = "Get InformationType")
    @ApiResponse(description = "InformationType fetched")
    @GetMapping("/{id}")
    public ResponseEntity<InformationTypeResponse> findForId(@PathVariable UUID id) {
        log.info("Received request for InformationType with the id={}", id);
        Optional<InformationTypeResponse> informationTypeResponse = repository.findById(id).map(InformationType::convertToResponse);
        if (informationTypeResponse.isEmpty()) {
            log.info("Cannot find the InformationType with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        log.info("Returned InformationType");
        return new ResponseEntity<>(informationTypeResponse.get(), HttpStatus.OK);
    }

    @Operation(summary = "Search InformationTypes")
    @ApiResponse(description = "InformationTypes fetched")
    @GetMapping("/search")
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> searchInformationTypeByName(@RequestParam("name") String name) {
        log.info("Received request for InformationTypes with the name like {}", name);
        if (name.length() < 3) {
            throw new ValidationException("Search term must be at least 3 characters");
        }
        List<InformationType> infoTypes = repository.findBySuggestLike(name);
        infoTypes.sort(comparing(it -> it.getData().getSuggest(), startsWith(name)));
        log.info("Returned {} InformationTypes", infoTypes.size());
        return new ResponseEntity<>(new RestResponsePage<>(convert(infoTypes, InformationType::convertToResponse)), HttpStatus.OK);
    }

    @Operation(summary = "Get All InformationTypes")
    @ApiResponse(description = "InformationTypes fetched")
    @GetMapping
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> findAll(PageParameters page,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String orgMaster,
            @RequestParam(required = false) String term,
            @RequestParam(required = false) String productArea,
            @RequestParam(required = false) String productTeam,
            @RequestParam(required = false) String sensitivity
    ) {
        log.info("Received request for all InformationTypes source={} term={}", source, term);
        List<InformationType> infoTypes = null;
        if (term != null) {
            infoTypes = repository.findByTermId(term);
        } else if (source != null) {
            infoTypes = repository.findBySource(source);
        } else if (orgMaster != null) {
            infoTypes = repository.findByOrgMaster(orgMaster);
        } else if (productTeam != null) {
            infoTypes = repository.findByProductTeam(productTeam);
        } else if (productArea != null) {
            var teams = teamService.getTeamsForProductArea(productArea);
            infoTypes = repository.findByProductTeams((convert(teams, Team::getId)));
        } else if(sensitivity != null){
            infoTypes = repository.findBySensitivity(sensitivity);
        }
        if (infoTypes != null) {
            var sorted = new ArrayList<>(infoTypes);
            sorted.sort(comparing(it -> it.getData().getName(), String.CASE_INSENSITIVE_ORDER));
            return ResponseEntity.ok(new RestResponsePage<>(convert(sorted, InformationType::convertToResponse)));
        }

        Page<InformationTypeResponse> informationTypes = repository.findAll(page.createIdSortedPage()).map(InformationType::convertToResponse);
        return ResponseEntity.ok(new RestResponsePage<>(informationTypes));
    }


    @Operation(summary = "Get All InformationTypes short")
    @ApiResponse(description = "InformationTypes short fetched")
    @GetMapping("/short")
    public ResponseEntity<RestResponsePage<InformationTypeShortResponse>> shorts() {
        return ResponseEntity.ok(new RestResponsePage<>(repository.findAllShort()));
    }

    @Operation(summary = "Count all InformationTypes")
    @ApiResponse(description = "Count of InformationTypes fetched")
    @GetMapping("/count")
    public Long countAllInformationTypes() {
        log.info("Received request for count all InformationTypes");
        return repository.count();
    }

    @Operation(summary = "Create InformationTypes")
    @ApiResponse(responseCode = "201", description = "InformationTypes to be created successfully accepted")
    @PostMapping
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> createInformationTypes(@RequestBody List<InformationTypeRequest> requests) {
        log.info("Received requests to create InformationTypes");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequest(requests, false);

        List<InformationTypeResponse> responses = service.saveAll(requests).stream().map(InformationType::convertToResponse).collect(Collectors.toList());
        return new ResponseEntity<>(new RestResponsePage<>(responses), HttpStatus.CREATED);
    }

    @Operation(summary = "Update InformationType")
    @ApiResponse(description = "InformationType to be updated successfully accepted")
    @PutMapping
    public ResponseEntity<RestResponsePage<InformationTypeResponse>> updateInformationTypes(@RequestBody List<InformationTypeRequest> requests) {
        log.info("Received requests to update InformationTypes");
        requests = StreamUtils.nullToEmptyList(requests);
        service.validateRequest(requests, true);

        List<InformationTypeResponse> responses = service.updateAll(requests).stream().map(InformationType::convertToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(new RestResponsePage<>(responses));
    }

    @Operation(summary = "Update InformationType")
    @ApiResponse(description = "Accepted one InformationType to be updated")
    @PutMapping("/{id}")
    public ResponseEntity<InformationTypeResponse> updateOneInformationTypeById(@PathVariable UUID id, @Valid @RequestBody InformationTypeRequest request) {
        log.info("Received a request to update InformationType with id={}", id);
        if (!id.equals(request.getIdAsUUID())) {
            throw new ValidationException(String.format("Mismatch between path and request id, id=%s request id=%s", id, request.getId()));
        }
        Optional<InformationType> byId = repository.findById(id);
        if (byId.isEmpty()) {
            log.info("Cannot find InformationType with id={}", id);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        service.validateRequest(List.of(request), true);

        InformationType informationType = service.update(request);

        log.info("Updated the InformationType");
        return new ResponseEntity<>(informationType.convertToResponse(), HttpStatus.OK);
    }

    @Operation(summary = "Delete InformationType")
    @ApiResponse(description = "InformationType deleted")
    @DeleteMapping("/{id}")
    @Transactional // TODO: Flytt dette inn til tjenestelaget
    public ResponseEntity<InformationTypeResponse> deleteInformationTypeById(@PathVariable UUID id) {
        log.info("Received a request to delete InformationType with id={}", id);
        if (id == null) {
            log.info("id missing");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.ok(service.delete(id).convertToResponse());
    }

    static final class InformationTypePage extends RestResponsePage<InformationTypeResponse> {
    }

    static final class InformationTypeShortPage extends RestResponsePage<InformationTypeShortResponse> {
    }

}
