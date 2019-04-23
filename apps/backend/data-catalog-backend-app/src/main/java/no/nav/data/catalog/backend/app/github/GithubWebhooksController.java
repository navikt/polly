package no.nav.data.catalog.backend.app.github;

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

@RestController
@Api(value = "Github Webhook", description = "Webhook called from github when push to navikt/pol-dataset is done", tags = { "webhook" })
public class GithubWebhooksController {

    @Autowired
    private GithubService service;

    @ApiOperation(value = "Post github push information", tags = { "webhook" })
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Pushinformation successfully posted", response = ResponseEntity.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @RequestMapping(value = "/backend/webhooks", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<AddDefaultCharsetFilter.ResponseWrapper> webhooks(@RequestBody GithubPushEventPayloadRequest payload) {
        payload.getGithubCommitList().forEach(commit -> commit.getAdded().forEach(fileAdded -> service.handle(fileAdded)));
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
