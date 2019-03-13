package no.nav.data.catalog.backend.app.rest;

import no.nav.data.catalog.backend.app.domain.GithubPushEventPayloadRequest;
import no.nav.data.catalog.backend.app.service.ProcessInformationDatasetService;
import org.apache.catalina.filters.AddDefaultCharsetFilter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class WebhooksRestController {
    private static final String SUCCESS = "Success";
    private static final String ERROR = "Error";

    private ProcessInformationDatasetService datasetService;

    public WebhooksRestController(ProcessInformationDatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @RequestMapping(value = "/webhooks", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<AddDefaultCharsetFilter.ResponseWrapper> webhooks(@RequestBody GithubPushEventPayloadRequest payload) {
        // if payload is empty, don't do anything
        payload.getGithubCommitList().forEach(commit -> commit.getAdded().forEach(fileAdded -> datasetService.retrieveAndSaveDataset(fileAdded)));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(value = "/test")
    @ResponseBody
    public ResponseEntity<AddDefaultCharsetFilter.ResponseWrapper> test(@RequestParam(value="filename") String filename) {
        datasetService.retrieveAndSaveDataset(filename);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
