package no.nav.data.polly.github;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.ValidationException;
import no.nav.data.polly.common.utils.CollectionDifference;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.common.utils.MdcUtils;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.github.dto.RepoModification;
import no.nav.data.polly.github.domain.status.GithubStatus;
import no.nav.data.polly.github.domain.status.GithubStatusRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.InformationTypeService;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import org.apache.commons.codec.digest.HmacUtils;
import org.eclipse.egit.github.core.Commit;
import org.eclipse.egit.github.core.CommitUser;
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

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import javax.transaction.Transactional;

import static java.util.Arrays.asList;
import static no.nav.data.polly.github.GithubConsumer.REFS_HEADS_MASTER;
import static no.nav.data.polly.informationtype.domain.InformationTypeMaster.GITHUB;

@Slf4j
@Transactional
@RestController
@RequestMapping(GithubWebhooksController.BACKEND_WEBHOOKS)
@Api(value = "Github Webhook", description = "Webhook called from github when push or pull-request update to navikt/pol-informationType is done", tags = {"webhook"})
public class GithubWebhooksController {

    public static final String BACKEND_WEBHOOKS = "/webhooks";

    public static final String PUSH_EVENT = "PushEvent";
    public static final String PULL_REQUEST_EVENT = "PullRequestEvent";

    public static final String HEADER_GITHUB_EVENT = "X-GitHub-Event";
    public static final String HEADER_GITHUB_ID = "X-GitHub-Delivery";
    public static final String HEADER_GITHUB_SIGNATURE = "X-Hub-Signature";

    private final InformationTypeService service;
    private final InformationTypeRepository repository;
    private final GithubStatusRepository githubStatusRepository;
    private final GithubConsumer githubConsumer;
    private final HmacUtils githubHmac;


    public GithubWebhooksController(InformationTypeService service,
            InformationTypeRepository repository,
            GithubStatusRepository githubStatusRepository,
            GithubConsumer githubConsumer,
            HmacUtils githubHmac) {
        this.service = service;
        this.repository = repository;
        this.githubStatusRepository = githubStatusRepository;
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

    private void processEvent(String jsonPayload, String eventType) {
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
        MdcUtils.setUser("github " + pullRequest.getUser().getName());
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
        List<ValidationError> validationErrors = validate(difference);
        githubConsumer.updateStatus(head, validationErrors);
    }

    private void processPushEvent(PushPayload payload) {
        MdcUtils.setUser("github " + getPushAuthor(payload));
        if (!REFS_HEADS_MASTER.equals(payload.getRef())) {
            log.info("Not master, skipping for ref {}", payload.getRef());
            return;
        }

        String internalBefore = findInternallyStoredBefore();
        log.info("Before {}, internal before {}, new head {}", payload.getBefore(), internalBefore, payload.getHead());
        CollectionDifference<InformationTypeRequest> difference = calculateDifference(internalBefore, payload.getHead());
        List<ValidationError> validationErrors = validate(difference);
        if (!validationErrors.isEmpty()) {
            throw new ValidationException(validationErrors, "The request was not accepted. The following errors occurred during validation: ");
        }
        remove(difference.getRemoved());
        modify(difference.getShared());
        add(difference.getAdded());

        githubStatusRepository.save(new GithubStatus(payload.getHead()));
    }

    private List<ValidationError> validate(CollectionDifference<InformationTypeRequest> difference) {
        List<ValidationError> validationErrors = new ArrayList<>();
        // TODO validate deletes, at least master, how does kafka delete?
        validationErrors.addAll(service.validateNoDuplicates(difference.getAfter()));
        validationErrors.addAll(service.validateRequestsAndReturnErrors(difference.getShared()));
        validationErrors.addAll(service.validateRequestsAndReturnErrors(difference.getAdded()));

        return validationErrors;
    }

    private String findInternallyStoredBefore() {
        return githubStatusRepository.findFirstByOrderByIdDesc().map(GithubStatus::getGithubSha).orElse(null);
    }

    private CollectionDifference<InformationTypeRequest> calculateDifference(String before, String head) {
        RepoModification repoModification = githubConsumer.compare(before, head);
        CollectionDifference<InformationTypeRequest> difference = repoModification.toChangelist();
        log.info("Add: {} Modify: {} Remove: {}", difference.getAdded().size(), difference.getShared()
                .size(), difference.getRemoved().size());
        return difference;
    }

    private void modify(List<InformationTypeRequest> requests) {
        if (requests.isEmpty()) {
            return;
        }
        log.info("The following list of InformationTypes have been set to be updated during the next scheduled task: {}", requests);
        service.updateAll(requests);
    }

    private void remove(Collection<InformationTypeRequest> requests) {
        if (requests.isEmpty()) {
            return;
        }
        log.info("The following list of InformationTypes have been set to be deleted during the next scheduled task: {}", requests);
        service.deleteAll(requests);
    }

    private void add(List<InformationTypeRequest> requests) {
        if (requests.isEmpty()) {
            return;
        }
        log.info("The following list of InformationTypes have been set to be added during the next scheduled task: {}", requests);
        service.saveAll(requests, GITHUB);
    }

    private String getPushAuthor(PushPayload payload) {
        return StreamUtils.safeStream(payload.getCommits())
                .filter(c -> c.getSha().equals(payload.getHead())).findFirst()
                .map(Commit::getAuthor)
                .map(CommitUser::getName)
                .orElse("-");
    }
}
