package no.nav.data.catalog.backend.app.github;

import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.github.domain.GithubPushEventPayloadRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import no.nav.data.catalog.backend.app.github.domain.GithubPushEventPayloadRequest;
import org.apache.catalina.filters.AddDefaultCharsetFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Api(value = "Github Webhook", description = "Webhook called from github when push to navikt/pol-dataset is done", tags = { "webhook" })
public class GithubWebhooksController {

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
    @RequestMapping(value = "/backend/webhooks", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> webhooks(@RequestBody GithubPushEventPayloadRequest payload) {
        payload.getGithubCommitList().forEach(commit -> commit.getAdded().forEach(fileAdded -> {
            List<InformationTypeRequest> requests = new InformationTypeRequest().convertFromGithubFile(restConsumer.getFile(fileAdded));
            requests.forEach(i -> {
                try {
                    service.validateRequest(i, false); // TODO: What if this is an update?
                } catch (ValidationException e) {
                    // TODO må få fikset return
                    new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST);           }
            });
            repository.saveAll(requests.stream().map(request -> new InformationType().convertFromRequest(request)).collect(Collectors.toList()));
        }));
//        return new ResponseEntity<InformationType>(repository.saveAll());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
