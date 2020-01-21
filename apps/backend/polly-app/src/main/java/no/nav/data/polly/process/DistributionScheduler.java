package no.nav.data.polly.process;

import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessDistribution;
import no.nav.data.polly.process.domain.ProcessDistributionRepository;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.groupingBy;
import static no.nav.data.polly.common.utils.MdcUtils.wrapAsync;
import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Service
public class DistributionScheduler {

    private final ProcessDistributionRepository distributionRepository;
    private final LeaderElectionService leaderElectionService;
    private final ProcessUpdateProducer processUpdateProducer;
    private final ProcessRepository processRepository;
    private final PolicyRepository policyRepository;

    public DistributionScheduler(ProcessDistributionRepository distributionRepository,
            LeaderElectionService leaderElectionService,
            ProcessUpdateProducer processUpdateProducer,
            ProcessRepository processRepository, PolicyRepository policyRepository,
            @Value("${behandlingsgrunnlag.distribute.rate.seconds}") Integer rateSeconds
    ) {
        this.distributionRepository = distributionRepository;
        this.leaderElectionService = leaderElectionService;
        this.processUpdateProducer = processUpdateProducer;
        this.processRepository = processRepository;
        this.policyRepository = policyRepository;
        scheduleDistributions(rateSeconds);
    }

    public void distributeAll() {
        if (!leaderElectionService.isLeader()) {
            return;
        }
        distributionRepository.findAll().stream().collect(groupingBy(pd -> pd.getData().getProcessId())).forEach(this::distribute);
    }

    private void distribute(UUID processId, List<ProcessDistribution> processDistributions) {
        Process process = processRepository.findById(processId).orElseThrow();
        var informationTypeNames = convert(policyRepository.findByProcessId(processId), Policy::getInformationTypeName);
        if (processUpdateProducer.sendProcess(process.getName(), process.getPurposeCode(), informationTypeNames)) {
            distributionRepository.deleteAll(processDistributions);
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
