package no.nav.data.polly.alert;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.exceptions.NotFoundException;
import no.nav.data.common.mail.MailTask;
import no.nav.data.common.security.SecurityUtils;
import no.nav.data.common.security.azure.AzureAdService;
import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.alert.domain.AlertEventType;
import no.nav.data.polly.alert.domain.AlertRepository;
import no.nav.data.polly.alert.domain.AlertRepositoryImpl.AlertEventRequest;
import no.nav.data.polly.alert.dto.DisclosureAlert;
import no.nav.data.polly.alert.dto.InformationTypeAlert;
import no.nav.data.polly.alert.dto.PolicyAlert;
import no.nav.data.polly.alert.dto.ProcessAlert;
import no.nav.data.polly.disclosure.domain.DisclosureRepository;
import no.nav.data.polly.informationtype.InformationTypeRepository;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.policy.domain.PolicyRepository;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.repo.ProcessRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.toList;
import static no.nav.data.common.utils.StreamUtils.convert;
import static no.nav.data.common.utils.StreamUtils.safeStream;

@Slf4j
@Service
public class AlertService {

    private static final String SENSITIVITY_ART9 = "SAERLIGE";

    private static final String ART_6_PREFIX = "ART6";
    private static final String ART_9_PREFIX = "ART9";

    private final AlertRepository alertRepository;

    private final ProcessRepository processRepository;
    private final PolicyRepository policyRepository;
    private final InformationTypeRepository informationTypeRepository;
    private final DisclosureRepository disclosureRepository;
    private final AzureAdService azureAdService;

    public AlertService(AlertRepository alertRepository, ProcessRepository processRepository, PolicyRepository policyRepository,
            InformationTypeRepository informationTypeRepository, DisclosureRepository disclosureRepository, AzureAdService azureAdService) {
        this.alertRepository = alertRepository;
        this.processRepository = processRepository;
        this.policyRepository = policyRepository;
        this.informationTypeRepository = informationTypeRepository;
        this.disclosureRepository = disclosureRepository;
        this.azureAdService = azureAdService;
    }

    public void testMail() {
        azureAdService.sendMail(MailTask.builder()
                .to(SecurityUtils.getCurrentUser().orElseThrow().getEmail())
                .subject("test").body("testbody").build());
    }

    // CALCULATE AND SAVE EVENTS

    @Transactional
    public void calculateEventsForInforamtionType(UUID informationTypeId) {
        var alerts = checkAlertsForInformationType(informationTypeId);
        var currentEvents = StreamUtils.convertFlat(alerts.getProcesses(), this::convertAlertsToEvents);
        var existingEvents = convert(alertRepository.findByInformationTypeId(informationTypeId), GenericStorage::toAlertEvent);
        updateEvents(existingEvents, currentEvents);
    }

    @Transactional
    public void calculateEventsForProcess(UUID processId) {
        var alerts = checkAlertsForProcess(processId);
        var currentEvents = convertAlertsToEvents(alerts);
        var existingEvents = convert(alertRepository.findByProcessId(processId), GenericStorage::toAlertEvent);
        updateEvents(existingEvents, currentEvents);
    }

    @Transactional
    public void calculateEventsForPolicy(Policy policy) {
        var alerts = checkProcess(policy.getProcess(), policy.getInformationType());
        var currentEvents = convertAlertsToEvents(alerts);
        UUID processId = policy.getProcess().getId();
        UUID informationTypeId = policy.getInformationTypeId();
        var existingEvents = convert(alertRepository.findByProcessIdAndInformationTypeId(processId, informationTypeId), GenericStorage::toAlertEvent);
        updateEvents(existingEvents, currentEvents);
    }

    @Transactional
    public void calculateEventsForDisclosure(UUID disclosureId) {
        var alerts = checkAlertsForDisclosure(disclosureId);
        var currentEvents = convertAlertsToEvents(alerts);
        var existingEvents = convert(alertRepository.findByDisclosureId(disclosureId), GenericStorage::toAlertEvent);
        updateEvents(existingEvents, currentEvents);
    }

    private void updateEvents(List<AlertEvent> existingEvents, List<AlertEvent> currentEvents) {
        var diff = StreamUtils.difference(existingEvents, currentEvents);

        diff.getRemoved().forEach(e -> alertRepository.deleteById(e.getId()));
        var newEvents = convert(diff.getAdded(), GenericStorage::new);
        alertRepository.saveAll(newEvents);
    }

    // DELETE

    @Transactional
    public void deleteEventsForInformationType(UUID informationTypeId) {
        int deleted = alertRepository.deleteByInformationTypeId(informationTypeId);
        log.info("deleted {} events for informationType {}", deleted, informationTypeId);
    }

    @Transactional
    public void deleteEventsForProcess(UUID processId) {
        int deleted = alertRepository.deleteByProcessId(processId);
        log.info("deleted {} events for process {}", deleted, processId);
    }

    @Transactional
    public void deleteEventsForPolicy(Policy policy) {
        int deleted = alertRepository.deleteByProcessIdAndInformationTypeId(policy.getProcess().getId(), policy.getInformationTypeId());
        log.info("deleted {} events for process {} informationType {}", deleted, policy.getProcess().getId(), policy.getInformationTypeId());
    }

    @Transactional
    public void deleteEventsForDisclosure(UUID disclosureId) {
        int deleted = alertRepository.deleteByDisclosureId(disclosureId);
        log.info("deleted {} events for disclosure {}", deleted, disclosureId);
    }

    // CONVERT TO EVENTS

    private List<AlertEvent> convertAlertsToEvents(ProcessAlert processAlert) {
        var alertEvents = new ArrayList<AlertEvent>();

        if (processAlert.isUsesAllInformationTypes()) {
            alertEvents.add(new AlertEvent(processAlert.getProcessId(), null, AlertEventType.USES_ALL_INFO_TYPE));
        }

        processAlert.getPolicies().forEach(pa -> alertEvents.addAll(convertAlertsToEvents(pa, processAlert.getProcessId())));

        return alertEvents;
    }

    private List<AlertEvent> convertAlertsToEvents(PolicyAlert policyAlert, UUID processId) {
        var alertEvents = new ArrayList<AlertEvent>();
        if (policyAlert.isMissingLegalBasis()) {
            alertEvents.add(new AlertEvent(processId, policyAlert.getInformationTypeId(), AlertEventType.MISSING_LEGAL_BASIS));
        }
        if (policyAlert.isExcessInfo()) {
            alertEvents.add(new AlertEvent(processId, policyAlert.getInformationTypeId(), AlertEventType.EXCESS_INFO));
        }
        if (policyAlert.isMissingArt6()) {
            alertEvents.add(new AlertEvent(processId, policyAlert.getInformationTypeId(), AlertEventType.MISSING_ARTICLE_6));
        }
        if (policyAlert.isMissingArt9()) {
            alertEvents.add(new AlertEvent(processId, policyAlert.getInformationTypeId(), AlertEventType.MISSING_ARTICLE_9));
        }
        return alertEvents;
    }

    private List<AlertEvent> convertAlertsToEvents(DisclosureAlert disclosureAlert) {
        var events = new ArrayList<AlertEvent>();
        if (disclosureAlert.isMissingArt6()) {
            events.add(new AlertEvent(disclosureAlert.getDisclosureId(), AlertEventType.MISSING_ARTICLE_6));
        }
        return events;
    }

    // CHECK ALERTS FOR OBJECTS

    @Transactional(readOnly = true)
    public InformationTypeAlert checkAlertsForInformationType(UUID informationTypeId) {
        var informationType = informationTypeRepository.findById(informationTypeId)
                .orElseThrow(() -> new NotFoundException("No information type for id " + informationTypeId + " found"));
        var alert = new InformationTypeAlert(informationTypeId, new ArrayList<>());

        List<Process> processes = policyRepository.findByInformationTypeId(informationTypeId).stream()
                .map(Policy::getProcess).distinct()
                .filter(Process::isActive)
                .collect(toList());

        for (Process process : processes) {
            checkProcess(process, informationType).resolve().ifPresent(alert.getProcesses()::add);
        }

        return alert;
    }

    @Transactional(readOnly = true)
    public ProcessAlert checkAlertsForProcess(UUID processId) {
        var process = processRepository.findById(processId)
                .orElseThrow(() -> new NotFoundException("No process for id " + processId + " found"));
        return checkProcess(process, null);
    }

    @Transactional(readOnly = true)
    public ProcessAlert checkAlertsForProcess(Process process) {
        return checkProcess(process, null);
    }

    @Transactional(readOnly = true)
    public DisclosureAlert checkAlertsForDisclosure(UUID disclosureId) {
        var disclosure = disclosureRepository.findById(disclosureId)
                .orElseThrow(() -> new NotFoundException("No disclosure for id " + disclosureId + " found"));
        var art6 = containsArticle(disclosure.getData().getLegalBases(), ART_6_PREFIX);
        return new DisclosureAlert(disclosure.getId(), !art6);
    }

    private ProcessAlert checkProcess(Process process, InformationType informationType) {
        var alert = new ProcessAlert(process.getId(), process.getData().isUsesAllInformationTypes(), new ArrayList<>());

        var processArt6 = containsArticle(process.getData().getLegalBases(), ART_6_PREFIX);
        var processArt9 = containsArticle(process.getData().getLegalBases(), ART_9_PREFIX);

        List<Policy> policies = StreamUtils.filter(process.getPolicies(), policy -> (informationType == null || policy.getInformationType().equals(informationType)));
        for (Policy policy : policies) {
            checkPolicy(processArt6, processArt9, policy).resolve().ifPresent(alert.getPolicies()::add);
        }

        return alert;
    }

    private PolicyAlert checkPolicy(boolean processArt6, boolean processArt9, Policy policy) {
        var requiresArt9 = requiresArt9(policy.getInformationType());

        var policyArt6 = containsArticle(policy.getData().getLegalBases(), ART_6_PREFIX);
        var policyArt9 = containsArticle(policy.getData().getLegalBases(), ART_9_PREFIX);

        var missingLegalBasis = policy.getData().getLegalBasesUse() == LegalBasesUse.UNRESOLVED;
        var excessInfo = policy.getData().getLegalBasesUse() == LegalBasesUse.EXCESS_INFO;

        var missingArt6 = !missingLegalBasis && !excessInfo && !policyArt6 && !processArt6;
        var missingArt9 = !missingLegalBasis && !excessInfo && requiresArt9 && !policyArt9 && !processArt9;

        return new PolicyAlert(policy.getId(), policy.getInformationTypeId(), missingLegalBasis, excessInfo, missingArt6, missingArt9);
    }

    private boolean requiresArt9(InformationType informationType) {
        return SENSITIVITY_ART9.equals(informationType.getData().getSensitivity());
    }

    private boolean containsArticle(List<LegalBasis> legalBases, String articlePrefix) {
        return safeStream(legalBases).anyMatch(lb -> lb.getGdpr().startsWith(articlePrefix));
    }

    @Transactional
    public Page<AlertEvent> getEvents(AlertEventRequest request) {
        return alertRepository.findAlerts(request);
    }

}
