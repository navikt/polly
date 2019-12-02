package no.nav.data.polly.process;

import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.common.validator.RequestElement;
import no.nav.data.polly.common.validator.RequestValidator;
import no.nav.data.polly.common.validator.ValidationError;
import no.nav.data.polly.policy.PolicyService;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessDistribution;
import no.nav.data.polly.process.domain.ProcessDistributionRepository;
import no.nav.data.polly.process.domain.ProcessRepository;
import no.nav.data.polly.process.dto.ProcessRequest;
import no.nav.data.polly.teams.TeamService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.stream.Collectors.groupingBy;
import static no.nav.data.polly.common.utils.MdcUtils.wrapAsync;

@Service
public class ProcessService extends RequestValidator<ProcessRequest> {

    private final ProcessDistributionRepository distributionRepository;
    private final ProcessUpdateProducer processUpdateProducer;
    private final PolicyService policyService;
    private final LeaderElectionService leaderElectionService;
    private final ProcessRepository processRepository;
    private final TeamService teamService;

    public ProcessService(ProcessDistributionRepository distributionRepository,
            PolicyService policyService, ProcessUpdateProducer processUpdateProducer,
            LeaderElectionService leaderElectionService,
            @Value("${behandlingsgrunnlag.distribute.rate.seconds}") Integer rateSeconds, ProcessRepository processRepository, TeamService teamService) {
        this.distributionRepository = distributionRepository;
        this.policyService = policyService;
        this.processUpdateProducer = processUpdateProducer;
        this.leaderElectionService = leaderElectionService;
        this.processRepository = processRepository;
        this.teamService = teamService;
        scheduleDistributions(rateSeconds);
    }

    public void scheduleDistributeForProcess(Process process) {
        distributionRepository.save(ProcessDistribution.newForProcess(process));
    }

    public void distributeAll() {
        if (!leaderElectionService.isLeader()) {
            return;
        }
        distributionRepository.findAll().stream().collect(groupingBy(ProcessDistribution::convertToProcess)).forEach(this::distribute);
    }

    private void distribute(Process process, List<ProcessDistribution> processDistributions) {
        List<String> informationTypeNames = policyService.findByPurposeCodeAndProcessName(process.getPurposeCode(), process.getName()).stream()
                .map(Policy::getInformationTypeName)
                .collect(Collectors.toList());
        if (processUpdateProducer.sendProcess(process.getName(), process.getPurposeCode(), informationTypeNames)) {
            processDistributions.forEach(bd -> distributionRepository.deleteById(bd.getId()));
        }
    }

    private void scheduleDistributions(int rate) {
        if (rate < 0) {
            return;
        }
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setThreadNamePrefix("BehGrnlgDist");
        scheduler.initialize();
        scheduler.scheduleAtFixedRate(wrapAsync(this::distributeAll, scheduler.getThreadNamePrefix()),
                Instant.now().plus(1, ChronoUnit.MINUTES), Duration.ofSeconds(rate));
    }

    public void validateRequests(List<ProcessRequest> requests, boolean update) {
        initialize(requests, update);
        var validationErrors = StreamUtils.applyAll(requests,
                RequestElement::validateFields,
                this::validateProcessRepositoryValues
        );

        ifErrorsThrowValidationException(validationErrors);
    }

    private List<ValidationError> validateProcessRepositoryValues(ProcessRequest request) {
        var validations = new ArrayList<ValidationError>();
        if (request.isUpdate()) {
            var repoValue = Optional.ofNullable(request.getIdAsUUID()).flatMap(processRepository::findById);
            validations.addAll(validateRepositoryValues(request, repoValue.isPresent()));

            if (repoValue.isPresent()) {
                Process process = repoValue.get();
                if (!Objects.equals(process.getName(), request.getName())) {
                    validations.add(new ValidationError(request.getReference(), "nameChanged",
                            format("Cannot change name from %s to %s", process.getName(), request.getName())));
                }
                if (!Objects.equals(process.getPurposeCode(), request.getPurposeCode())) {
                    validations.add(new ValidationError(request.getReference(), "purposeChanged",
                            format("Cannot change purpose from %s to %s", process.getPurposeCode(), request.getPurposeCode())));
                }
            }
        } else {
            validations.addAll(validateRepositoryValues(request, false));
            if (processRepository.findByNameAndPurposeCode(request.getName(), request.getPurposeCode()).isPresent()) {
                validations.add(new ValidationError(request.getReference(), "nameAndPurposeExists",
                        format("Process with name %s and Purpose %s already exists", request.getName(), request.getPurposeCode())));
            }
        }
        if (StringUtils.isNotBlank(request.getProductTeam()) && !teamService.teamExists(request.getProductTeam())) {
            validations.add(new ValidationError(request.getReference(), "invalidProductTeam", "Product team " + request.getProductTeam() + " does not exist"));
        }
        return validations;
    }

}
