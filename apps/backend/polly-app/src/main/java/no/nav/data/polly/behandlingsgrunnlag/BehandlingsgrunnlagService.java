package no.nav.data.polly.behandlingsgrunnlag;

import no.nav.data.polly.behandlingsgrunnlag.domain.BehandlingsgrunnlagDistribution;
import no.nav.data.polly.common.nais.LeaderElectionService;
import no.nav.data.polly.informationtype.InformationType;
import no.nav.data.polly.informationtype.InformationTypeData;
import no.nav.data.polly.policy.PolicyService;
import no.nav.data.polly.policy.entities.Policy;
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
public class BehandlingsgrunnlagService {

    private final BehandlingsgrunnlagDistributionRepository distributionRepository;
    private final PolicyService policyService;
    private final BehandlingsgrunnlagProducer behandlingsgrunnlagProducer;
    private final LeaderElectionService leaderElectionService;

    public BehandlingsgrunnlagService(BehandlingsgrunnlagDistributionRepository distributionRepository,
            PolicyService policyService, BehandlingsgrunnlagProducer behandlingsgrunnlagProducer,
            LeaderElectionService leaderElectionService,
            @Value("${behandlingsgrunnlag.distribute.rate.seconds}") Integer rateSeconds) {
        this.distributionRepository = distributionRepository;
        this.policyService = policyService;
        this.behandlingsgrunnlagProducer = behandlingsgrunnlagProducer;
        this.leaderElectionService = leaderElectionService;
        scheduleDistributions(rateSeconds);
    }

    public void scheduleDistributeForPurpose(String purpose) {
        distributionRepository.save(BehandlingsgrunnlagDistribution.newForPurpose(purpose));
    }

    public void distributeAll() {
        if (!leaderElectionService.isLeader()) {
            return;
        }
        distributionRepository.findAll().stream().collect(groupingBy(BehandlingsgrunnlagDistribution::getPurpose)).forEach(this::distribute);
    }

    private void distribute(String purpose, List<BehandlingsgrunnlagDistribution> behandlingsgrunnlagDistributions) {
        List<String> datasetTitles = policyService.findActiveByPurposeCode(purpose).stream()
                .map(Policy::getInformationType)
                .map(InformationType::getData)
                .map(InformationTypeData::getName)
                .collect(Collectors.toList());
        if (behandlingsgrunnlagProducer.sendBehandlingsgrunnlag(purpose, datasetTitles)) {
            behandlingsgrunnlagDistributions.forEach(bd -> distributionRepository.deleteById(bd.getId()));
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
