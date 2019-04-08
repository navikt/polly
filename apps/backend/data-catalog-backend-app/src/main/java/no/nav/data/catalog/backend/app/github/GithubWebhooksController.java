package no.nav.data.catalog.backend.app.github;

import no.nav.data.catalog.backend.app.github.domain.GithubPushEventPayloadRequest;
import no.nav.data.catalog.backend.app.github.GithubService;
import org.apache.catalina.filters.AddDefaultCharsetFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class GithubWebhooksController {

    @Autowired
    private GithubService service;

    @RequestMapping(value = "/backend/webhooks", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<AddDefaultCharsetFilter.ResponseWrapper> webhooks(@RequestBody GithubPushEventPayloadRequest payload) {
        payload.getGithubCommitList().forEach(commit -> commit.getAdded().forEach(fileAdded -> service.handle(fileAdded)));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // TODO: Remove this
    @GetMapping(value = "/test")
    @ResponseBody
    public ResponseEntity<AddDefaultCharsetFilter.ResponseWrapper> test(@RequestParam(value="filename") String filename) {
        service.handle(filename);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
