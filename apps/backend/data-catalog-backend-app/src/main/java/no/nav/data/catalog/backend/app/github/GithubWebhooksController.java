package no.nav.data.catalog.backend.app.github;

import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.github.domain.GithubPushEventPayloadRequest;
import no.nav.data.catalog.backend.app.github.GithubService;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import org.apache.catalina.filters.AddDefaultCharsetFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
public class GithubWebhooksController {

    @Autowired
    private InformationTypeService service;

    @Autowired
    private InformationTypeRepository repository;

    @Autowired
    private GithubConsumer restConsumer;

    @RequestMapping(value = "/backend/webhooks", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> webhooks(@RequestBody GithubPushEventPayloadRequest payload) {
        payload.getGithubCommitList().forEach(commit -> commit.getAdded().forEach(fileAdded -> {
            List<InformationTypeRequest> requests = new InformationTypeRequest().convertFromGithubFile(restConsumer.getFile(fileAdded));
            requests.forEach(i -> {
                try {
                    service.validateRequest(i, false); // TODO: What if this is an update?
                } catch (ValidationException e) {
                    return new ResponseEntity<>(e.get(), HttpStatus.BAD_REQUEST); // TODO: Here's trouble!
                }
            });
        }));

        return new ResponseEntity<InformationType>(repository.saveAll());
    }

    // TODO: Remove this
    @GetMapping(value = "/test")
    @ResponseBody
    public ResponseEntity<AddDefaultCharsetFilter.ResponseWrapper> test(@RequestParam(value="filename") String filename) {
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
