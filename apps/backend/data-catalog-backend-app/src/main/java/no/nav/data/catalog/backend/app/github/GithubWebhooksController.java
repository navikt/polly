package no.nav.data.catalog.backend.app.github;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.github.domain.GithubPushEventPayloadRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/backend/webhooks")
@Api(value = "Github Webhook", description = "Webhook called from github when push to navikt/pol-dataset is done", tags = { "webhook" })
public class GithubWebhooksController {

    private static final Logger logger = LoggerFactory.getLogger(GithubWebhooksController.class);

    @Autowired
    private InformationTypeService service;

    @Autowired
    private InformationTypeRepository repository;

    @Autowired
    private GithubConsumer restConsumer;

    @ApiOperation(value = "Post github push information", tags = { "webhook" })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Pushinformation successfully posted", response = ResponseEntity.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    @ResponseBody
    public ResponseEntity<?> webhooks(@RequestBody GithubPushEventPayloadRequest payload) {
        logger.info("webhooks: Received request to process InformationTypeRequests from Github");
        payload.getGithubCommitList().forEach(commit -> commit.getAdded().forEach(fileAdded -> {
            List<InformationTypeRequest> requests = new InformationTypeRequest().convertFromGithubFile(restConsumer.getFile(fileAdded));
            requests.forEach(i -> {
                try {
                    service.validateRequest(i, false); // TODO: What if this is an update?
                } catch (ValidationException e) {
                    // TODO må få fikset return
                    logger.error("Validation error occurred validating file downloaded from Github", e);
                    throw e;
                }
            });
            repository.saveAll(requests.stream()
                    .map(request -> new InformationType().convertFromRequest(request, false))
                    .collect(Collectors.toList()));  //TODO: Fiks hvis update
        }));
//        return new ResponseEntity<InformationType>(repository.saveAll());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
