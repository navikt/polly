package no.nav.data.catalog.backend.app.github;

import static java.util.Arrays.asList;
import static no.nav.data.catalog.backend.app.github.GithubConsumer.REFS_HEADS_MASTER;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import javax.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.utils.CollectionDifference;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus;
import no.nav.data.catalog.backend.app.github.domain.RepoModification;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import no.nav.data.catalog.backend.app.poldatasett.PolDatasett;
import no.nav.data.catalog.backend.app.poldatasett.PolDatasettRepository;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.PullRequest;
import org.eclipse.egit.github.core.event.PullRequestPayload;
import org.eclipse.egit.github.core.event.PushPayload;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Transactional
@RestController
@RequestMapping(GithubWebhooksController.BACKEND_WEBHOOKS)
@Api(value = "Github Webhook", description = "Webhook called from github when push or pull-request update to navikt/pol-dataset is done", tags = {"webhook"})
public class GithubWebhooksController {

    public static final String BACKEND_WEBHOOKS = "/webhooks";

    public static final String PUSH_EVENT = "PushEvent";
    public static final String PULL_REQUEST_EVENT = "PullRequestEvent";

    public static final String HEADER_GITHUB_EVENT = "X-GitHub-Event";
    public static final String HEADER_GITHUB_ID = "X-GitHub-Delivery";
    public static final String HEADER_GITHUB_SIGNATURE = "X-Hub-Signature";

    private final InformationTypeService service;
    private final InformationTypeRepository repository;
    private final PolDatasettRepository polDatasettRepository;
    private final GithubConsumer githubConsumer;
    private final HmacUtils githubHmac;


    public GithubWebhooksController(InformationTypeService service,
            InformationTypeRepository repository,
            PolDatasettRepository polDatasettRepository,
            GithubConsumer githubConsumer,
            HmacUtils githubHmac) {
        this.service = service;
        this.repository = repository;
        this.polDatasettRepository = polDatasettRepository;
        this.githubConsumer = githubConsumer;
        this.githubHmac = githubHmac;
    }

    @ApiOperation(value = "Post github push or pull-request events", tags = {"webhook"})
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Successfully posted", response = ResponseEntity.class),
            @ApiResponse(code = 400, message = "Illegal arguments"),
            @ApiResponse(code = 500, message = "Internal server error")})
    @PostMapping
    @ResponseBody
    public ResponseEntity<?> webhooks(
            @RequestBody String jsonPayload,
            @RequestHeader(HEADER_GITHUB_EVENT) String eventType,
            @RequestHeader(HEADER_GITHUB_ID) String webhookId,
            @RequestHeader(HEADER_GITHUB_SIGNATURE) String signature
    ) {
        log.info("webhooks: Received request to process webhook {} {} from Github", eventType, webhookId);
        String calculatedSignature = "sha1=" + githubHmac.hmacHex(jsonPayload);
        if (!calculatedSignature.equals(signature)) {
            log.warn("webhooks: Received invalid signature");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid signature");
        }

        processEvent(jsonPayload, eventType);
        return ResponseEntity.ok().build();
    }

    private void processEvent(@RequestBody String jsonPayload, String eventType) {
        try {
            if (PUSH_EVENT.equals(eventType)) {
                processPushEvent(JsonUtils.toObject(jsonPayload, PushPayload.class));
            } else if (PULL_REQUEST_EVENT.equals(eventType)) {
                processPullRequestEvent(JsonUtils.toObject(jsonPayload, PullRequestPayload.class));
            } else {
                log.warn("skipping unknown eventType {}", eventType);
            }
        } catch (RuntimeException e) {
            log.error(String.format("Webhook event %s failed", eventType), e);
            throw e;
        }
    }

    private void processPullRequestEvent(PullRequestPayload payload) {
        log.info("Pull request #{} event {}", payload.getNumber(), payload.getAction());
        PullRequest pullRequest = payload.getPullRequest();
        String fromBranch = pullRequest.getHead().getRef();
        String toBranch = pullRequest.getBase().getRef();
        if (!toBranch.equals("master")) {
            log.info("skipping change to pull request from {} to non-master branch {}", fromBranch, toBranch);
            return;
        } else if (!asList("opened", "edited", "reopened").contains(payload.getAction())) {
            log.info("skipping pull request from {} to {} for action {}", fromBranch, toBranch, payload.getAction());
            return;
        }

        String head = pullRequest.getHead().getSha();
        String before = pullRequest.getBase().getSha();
        log.info("validating pull request from {} {} to {} {}", fromBranch, before, toBranch, head);

        CollectionDifference<InformationTypeRequest> difference = calculateDifference(before, head);
        List<String> validate = validate(difference);
        githubConsumer.updateStatus(head, validate);
    }

    private void processPushEvent(PushPayload payload) {
        if (!REFS_HEADS_MASTER.equals(payload.getRef())) {
            log.info("Not master, skipping for ref {}", payload.getRef());
            return;
        }

        String internalBefore = findInternallyStoredBefore();
        log.info("Before {}, internal before {}, new head {}", payload.getBefore(), internalBefore, payload.getHead());
        CollectionDifference<InformationTypeRequest> difference = calculateDifference(internalBefore, payload.getHead());
        List<String> validate = validate(difference);
        if (!validate.isEmpty()) {
            throw new IllegalArgumentException(String.format("Validation errors: %s", validate));
        }
        remove(difference.getRemoved());
        modify(difference.getShared());
        add(difference.getAdded());

        polDatasettRepository.save(new PolDatasett(payload.getHead()));
    }

    private List<String> validate(CollectionDifference<InformationTypeRequest> difference) {
        List<String> validationErrors = new ArrayList<>();

        // To validate that there aren't duplicates across add and modify
        difference.getAfter().stream()
                .filter(element -> difference.getAfter().stream().anyMatch(compare -> !element.equals(compare) && element.getName().equals(compare.getName())))
                .map(element -> String.format("%s duplicate entry", element.getRequestReference().orElse(null)))
                .forEach(validationErrors::add);

        mapErrors(service.validateRequestsAndReturnErrors(difference.getShared(), true), validationErrors);
        mapErrors(service.validateRequestsAndReturnErrors(difference.getAdded(), false), validationErrors);

        return validationErrors;
    }

    private void mapErrors(Map<String, Map<String, String>> validationErrorsMap, List<String> validationErrors) {
        validationErrorsMap
                .entrySet().stream()
                .flatMap(entry -> entry.getValue().values().stream().map(value -> entry.getKey() + " " + value))
                .forEach(validationErrors::add);
    }

    private String findInternallyStoredBefore() {
        return polDatasettRepository.findFirstByOrderByIdDesc().map(PolDatasett::getGithubSha).orElse(null);
    }

    private CollectionDifference<InformationTypeRequest> calculateDifference(String before, String head) {
        RepoModification repoModification = githubConsumer.compare(before, head);
        CollectionDifference<InformationTypeRequest> difference = repoModification.toChangelist();
        log.info("Add: {} Modify: {} Remove: {}", difference.getAdded().size(), difference.getShared().size(), difference.getRemoved().size());
        return difference;
    }

    private void modify(Collection<InformationTypeRequest> requests) {
        if (requests.isEmpty()) {
            return;
        }
        List<InformationType> updatedInformationTypes = service.returnUpdatedInformationTypesIfAllArePresent(requests);
        log.info("The following list of InformationTypes have been set to be updated during the next scheduled task: {}", updatedInformationTypes);
        repository.saveAll(updatedInformationTypes);
    }

    private void remove(Collection<InformationTypeRequest> requests) {
        if (requests.isEmpty()) {
            return;
        }
        List<InformationType> toBeDeletedInformationTypes = new ArrayList<>();
        requests.forEach(request -> {
            String name = request.getName().trim();
            Optional<InformationType> fromRepository = repository.findByName(name);
            if (fromRepository.isEmpty()) {
                log.warn("Cannot find InformationType with name={} for deletion", name);
                return;
            }
            fromRepository.get().setElasticsearchStatus(ElasticsearchStatus.TO_BE_DELETED);
            toBeDeletedInformationTypes.add(fromRepository.get());
        });
        log.info("The following list of InformationTypes have been set to be deleted during the next scheduled task: {}", toBeDeletedInformationTypes);
        repository.saveAll(toBeDeletedInformationTypes);
    }

    private void add(Collection<InformationTypeRequest> requests) {
        if (requests.isEmpty()) {
            return;
        }
        log.info("The following list of InformationTypes have been set to be added during the next scheduled task: {}", requests);
        repository.saveAll(requests.stream()
                .map(request -> new InformationType().convertFromRequest(request, false))
                .collect(Collectors.toList()));
    }
}
