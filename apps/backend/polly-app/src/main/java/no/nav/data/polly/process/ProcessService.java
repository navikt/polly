package no.nav.data.polly.process;

import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.policy.PolicyService;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessDistribution;
import no.nav.data.polly.process.domain.ProcessDistributionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;
import static no.nav.data.polly.common.utils.MdcUtils.wrapAsync;

@Service
public class ProcessService {

    private final ProcessDistributionRepository distributionRepository;
    private final ProcessUpdateProducer processUpdateProducer;
    private final PolicyService policyService;
    private final LeaderElectionService leaderElectionService;

    public ProcessService(ProcessDistributionRepository distributionRepository,
            PolicyService policyService, ProcessUpdateProducer processUpdateProducer,
            LeaderElectionService leaderElectionService,
            @Value("${behandlingsgrunnlag.distribute.rate.seconds}") Integer rateSeconds) {
        this.distributionRepository = distributionRepository;
        this.policyService = policyService;
        this.processUpdateProducer = processUpdateProducer;
        this.leaderElectionService = leaderElectionService;
        scheduleDistributions(rateSeconds);
    }

    public void scheduleDistributeForPurpose(Process process) {
        distributionRepository.save(ProcessDistribution.newForPurpose(process.getName(), process.getPurposeCode()));
    }

    public void distributeAll() {
        if (!leaderElectionService.isLeader()) {
            return;
        }
        distributionRepository.findAll().stream().collect(groupingBy(ProcessDistribution::convertToProcess)).forEach(this::distribute);
    }

    private void distribute(Process process, List<ProcessDistribution> processDistributions) {
        List<String> informationTypeNames = policyService.findActiveByPurposeCode(process.getPurposeCode()).stream()
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

}
