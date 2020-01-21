package no.nav.data.polly.process;

import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.policy.PolicyService;
import no.nav.data.polly.policy.domain.Policy;
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
public class DistributionScheduler {

    private final ProcessDistributionRepository distributionRepository;
    private final LeaderElectionService leaderElectionService;
    private final ProcessUpdateProducer processUpdateProducer;
    private final PolicyService policyService;

    public DistributionScheduler(ProcessDistributionRepository distributionRepository,
            LeaderElectionService leaderElectionService,
            PolicyService policyService,
            ProcessUpdateProducer processUpdateProducer,
            @Value("${behandlingsgrunnlag.distribute.rate.seconds}") Integer rateSeconds
    ) {
        this.distributionRepository = distributionRepository;
        this.leaderElectionService = leaderElectionService;
        this.processUpdateProducer = processUpdateProducer;
        this.policyService = policyService;
        scheduleDistributions(rateSeconds);
    }

    public void distributeAll() {
        if (!leaderElectionService.isLeader()) {
            return;
        }
        distributionRepository.findAll().stream().collect(groupingBy(p -> new ProcessId(p.getProcess(), p.getPurposeCode()))).forEach(this::distribute);
    }

    private void distribute(ProcessId process, List<ProcessDistribution> processDistributions) {
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

    @lombok.Value
    private static class ProcessId {

        private String name;
        private String purposeCode;
    }
}
