package no.nav.data.polly.alert;


import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.alert.domain.AlertEventType;
import no.nav.data.polly.alert.domain.AlertRepository;
import no.nav.data.polly.common.storage.domain.GenericStorageRepository;
import no.nav.data.polly.common.storage.domain.StorageType;
import no.nav.data.polly.policy.domain.Policy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class AlertIT extends IntegrationTestBase {

    @Autowired
    private AlertService alertService;
    @Autowired
    private AlertRepository alertRepository;
    @Autowired
    private GenericStorageRepository genericStorageRepository;

    @BeforeEach
    void setUp() {
        genericStorageRepository.deleteByType(StorageType.ALERT_EVENT);
    }

    @Nested
    class Alerts {

        @Test
        void processAlertsPolicyMissingLegalBasis() {
            var policy = createProcessWithOnePolicyNoLegalBasis();

            var alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());

            assertThat(alerts.getProcessId()).isEqualTo(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(1);
            assertThat(alerts.getPolicies().get(0).getPolicyId()).isEqualTo(policy.getId());
            assertThat(alerts.getPolicies().get(0).getInformationTypeId()).isEqualTo(policy.getInformationTypeId());
            assertThat(alerts.getPolicies().get(0).isMissingLegalBasis()).isTrue();
            assertThat(alerts.getPolicies().get(0).isMissingArt6()).isFalse();
            assertThat(alerts.getPolicies().get(0).isMissingArt9()).isFalse();
        }

        @Test
        void processAlertsPolicyMissingLegalBasisArt9() {
            var policy = createProcessWithOnePolicyArt9NoLegalBasis();

            var alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());

            assertThat(alerts.getProcessId()).isEqualTo(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(1);
            assertThat(alerts.getPolicies().get(0).getPolicyId()).isEqualTo(policy.getId());
            assertThat(alerts.getPolicies().get(0).getInformationTypeId()).isEqualTo(policy.getInformationTypeId());
            assertThat(alerts.getPolicies().get(0).isMissingLegalBasis()).isTrue();
            assertThat(alerts.getPolicies().get(0).isMissingArt6()).isFalse();
            assertThat(alerts.getPolicies().get(0).isMissingArt9()).isTrue();
        }

        @Test
        void processNoAlerts() {
            var policy = createProcessWithOnePolicy();
            var alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(0);

            policy.getData().setLegalBases(List.of());
            policy.getData().setLegalBasesInherited(true);
            policyRepository.save(policy);
            policy.getProcess().getData().setLegalBases(List.of(createLegalBasis()));
            processRepository.save(policy.getProcess());

            alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(0);
        }
    }

    @Nested
    class Events {

        @Test
        void processAlertEvents() {
            var policy = createProcessWithOnePolicyNoLegalBasis();

            alertService.calculateEventsForProcess(policy.getProcess().getId());
            var events = alertRepository.findByProcessId(policy.getProcess().getId());

            assertThat(events).hasSize(1);
            AlertEvent alertEvent = events.get(0).toAlertEvent();
            assertThat(alertEvent.getProcessId()).isEqualTo(policy.getProcess().getId());
            assertThat(alertEvent.getInformationTypeId()).isEqualTo(policy.getInformationTypeId());
            assertThat(alertEvent.getType()).isEqualTo(AlertEventType.MISSING_LEGAL_BASIS);
            assertThat(alertEvent.getLevel()).isEqualTo(alertEvent.getType().getLevel());
        }

        @Test
        void processAlertNoEvents() {
            var policy = createProcessWithOnePolicy();
            alertService.calculateEventsForProcess(policy.getProcess().getId());
            var events = alertRepository.findByProcessId(policy.getProcess().getId());
            assertThat(events).hasSize(0);
        }

        @Test
        void deleteOldAlerts() {
            processAlertEvents();
            var policy = policyRepository.findAll().get(0);
            policy.getData().setLegalBases(List.of(createLegalBasis()));
            policyRepository.save(policy);

            alertService.calculateEventsForProcess(policy.getProcess().getId());
            var events = alertRepository.findByProcessId(policy.getProcess().getId());
            assertThat(events).hasSize(0);
        }
    }

    private Policy createProcessWithOnePolicy() {
        var policy = createProcessWithOnePolicyNoLegalBasis();
        policy.getData().setLegalBases(List.of(createLegalBasis()));
        return policyRepository.save(policy);
    }

    private Policy createProcessWithOnePolicyNoLegalBasis() {
        var process = createAndSaveProcess("AAP");
        process.getData().setUsesAllInformationTypes(false);
        processRepository.save(process);
        var policy = createPolicy("AAP", "BRUKER", List.of());
        policy.setInformationType(createAndSaveInformationType("name", "POL"));
        return addPolicy(process, policy);
    }

    private Policy createProcessWithOnePolicyArt9NoLegalBasis() {
        var process = createAndSaveProcess("AAP");
        process.getData().setUsesAllInformationTypes(false);
        processRepository.save(process);
        var policy = createPolicy("AAP", "BRUKER", List.of());
        policy.setInformationType(createAndSaveInformationType("name", "SAERLIGE"));
        return addPolicy(process, policy);
    }

}
