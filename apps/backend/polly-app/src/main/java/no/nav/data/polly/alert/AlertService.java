package no.nav.data.polly.alert;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.alert.dto.InformationTypeAlert;
import no.nav.data.polly.alert.dto.PolicyAlert;
import no.nav.data.polly.alert.dto.ProcessAlert;
import no.nav.data.polly.common.exceptions.PollyNotFoundException;
import no.nav.data.polly.common.utils.StreamUtils;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Slf4j
@Service
@Transactional(readOnly = true)
public class AlertService {

    private static final String SENSITIVITY_ART9 = "SAERLIGE";

    private static final String ART_6_PREFIX = "ART6";
    private static final String ART_9_PREFIX = "ART9";

    private final ProcessRepository processRepository;
    private final InformationTypeRepository informationTypeRepository;

    public AlertService(ProcessRepository processRepository, InformationTypeRepository informationTypeRepository) {
        this.processRepository = processRepository;
        this.informationTypeRepository = informationTypeRepository;
    }

    public InformationTypeAlert checkAlertsForInformationType(UUID informationTypeId) {
        var informationType = informationTypeRepository.findById(informationTypeId)
                .orElseThrow(() -> new PollyNotFoundException("No information type for id " + informationTypeId + " found"));
        var alert = new InformationTypeAlert(informationTypeId, new ArrayList<>());

        List<Process> processes = informationType.getPolicies().stream().map(Policy::getProcess).distinct().collect(Collectors.toList());

        for (Process process : processes) {
            checkProcess(process, informationType).resolve().ifPresent(alert.getProcesses()::add);
        }

        return alert;
    }

    public ProcessAlert checkAlertsForProcess(UUID processId) {
        var process = processRepository.findById(processId)
                .orElseThrow(() -> new PollyNotFoundException("No process for id " + processId + " found"));
        return checkProcess(process, null);
    }

    private ProcessAlert checkProcess(Process process, InformationType informationType) {
        var alert = new ProcessAlert(process.getId(), new ArrayList<>());

        var processArt6 = containsArticle(process.getData().getLegalBases(), ART_6_PREFIX);
        var processArt9 = containsArticle(process.getData().getLegalBases(), ART_9_PREFIX);

        List<Policy> policies = StreamUtils.filter(process.getPolicies(), policy -> informationType == null || policy.getInformationType().equals(informationType));
        for (Policy policy : policies) {
            checkPolicy(processArt6, processArt9, policy).resolve().ifPresent(alert.getPolicies()::add);
        }

        return alert;
    }

    private PolicyAlert checkPolicy(boolean processArt6, boolean processArt9, Policy policy) {
        var requiresArt9 = requiresArt9(policy.getInformationType());

        var policyArt6 = containsArticle(policy.getData().getLegalBases(), ART_6_PREFIX);
        var policyArt9 = containsArticle(policy.getData().getLegalBases(), ART_9_PREFIX);

        var missingArt6 = !policyArt6 && !processArt6;
        var missingArt9 = requiresArt9 && !policyArt9 && !processArt9;
        var missingLegalBasis = !policy.getData().isLegalBasesInherited() && CollectionUtils.isEmpty(policy.getData().getLegalBases());

        return new PolicyAlert(policy.getId(), missingLegalBasis, missingArt6, missingArt9);
    }

    private boolean requiresArt9(InformationType informationType) {
        return SENSITIVITY_ART9.equals(informationType.getData().getSensitivity());
    }

    private boolean containsArticle(List<LegalBasis> legalBases, String articlePrefix) {
        return safeStream(legalBases).anyMatch(lb -> lb.getGdpr().startsWith(articlePrefix));
    }
}
