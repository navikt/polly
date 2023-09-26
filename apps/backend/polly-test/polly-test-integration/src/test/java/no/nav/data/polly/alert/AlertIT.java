package no.nav.data.polly.alert;


import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.storage.domain.StorageType;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.alert.AlertController.EventPage;
import no.nav.data.polly.alert.AlertController.EventPage.AlertSort;
import no.nav.data.polly.alert.domain.AlertEvent;
import no.nav.data.polly.alert.domain.AlertEventType;
import no.nav.data.polly.alert.domain.AlertRepository;
import no.nav.data.polly.alert.dto.DisclosureAlert;
import no.nav.data.polly.disclosure.DisclosureService;
import no.nav.data.polly.disclosure.dto.DisclosureRequest;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.policy.domain.LegalBasesUse;
import no.nav.data.polly.policy.domain.Policy;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static java.util.UUID.randomUUID;
import static no.nav.data.common.utils.StreamUtils.convert;
import static org.assertj.core.api.Assertions.assertThat;

public class AlertIT extends IntegrationTestBase {

    @Autowired
    private TestRestTemplate restTemplate;
    @Autowired
    private AlertService alertService;
    @Autowired
    private AlertRepository alertRepository;
    @Autowired
    private DisclosureService disclosureService;

    @BeforeEach
    void setUp() {
        genericStorageRepository.deleteByType(StorageType.ALERT_EVENT);
    }

    @Nested
    class Alerts {

        @Test
        void processAlertsPolicyMissingArt6() {
            var policy = createProcessWithOnePolicyNoLegalBasis();

            var alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());

            assertThat(alerts.getProcessId()).isEqualTo(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(1);
            assertThat(alerts.getPolicies().get(0).getPolicyId()).isEqualTo(policy.getId());
            assertThat(alerts.getPolicies().get(0).getInformationTypeId()).isEqualTo(policy.getInformationTypeId());
            assertThat(alerts.getPolicies().get(0).isMissingLegalBasis()).isFalse();
            assertThat(alerts.getPolicies().get(0).isExcessInfo()).isFalse();
            assertThat(alerts.getPolicies().get(0).isMissingArt6()).isTrue();
            assertThat(alerts.getPolicies().get(0).isMissingArt9()).isFalse();
        }

        @Test
        void processAlertsPolicyMissingArt9() {
            var policy = createProcessWithOnePolicyArt9NoLegalBasis();

            var alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());

            assertThat(alerts.getProcessId()).isEqualTo(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(1);
            assertThat(alerts.getPolicies().get(0).getPolicyId()).isEqualTo(policy.getId());
            assertThat(alerts.getPolicies().get(0).getInformationTypeId()).isEqualTo(policy.getInformationTypeId());
            assertThat(alerts.getPolicies().get(0).isMissingLegalBasis()).isFalse();
            assertThat(alerts.getPolicies().get(0).isExcessInfo()).isFalse();
            assertThat(alerts.getPolicies().get(0).isMissingArt6()).isFalse();
            assertThat(alerts.getPolicies().get(0).isMissingArt9()).isTrue();
        }

        @Test
        void processAlertsPolicyExcessInfo() {
            var policy = createProcessWithOnePolicyNoLegalBasis();
            policy.getData().setLegalBasesUse(LegalBasesUse.EXCESS_INFO);
            policyRepository.save(policy);

            var alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());

            assertThat(alerts.getProcessId()).isEqualTo(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(1);
            assertThat(alerts.getPolicies().get(0).getPolicyId()).isEqualTo(policy.getId());
            assertThat(alerts.getPolicies().get(0).getInformationTypeId()).isEqualTo(policy.getInformationTypeId());
            assertThat(alerts.getPolicies().get(0).isMissingLegalBasis()).isFalse();
            assertThat(alerts.getPolicies().get(0).isExcessInfo()).isTrue();
            assertThat(alerts.getPolicies().get(0).isMissingArt6()).isFalse();
            assertThat(alerts.getPolicies().get(0).isMissingArt9()).isFalse();
        }

        @Test
        void processNoAlerts() {
            var policy = createProcessWithOnePolicy();
            var alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(0);

            policy.getData().setLegalBases(List.of());
            policy.getData().setLegalBasesUse(LegalBasesUse.INHERITED_FROM_PROCESS);
            policyRepository.save(policy);
            policy.getProcess().getData().setLegalBases(List.of(createLegalBasis()));
            processRepository.save(policy.getProcess());

            alerts = alertService.checkAlertsForProcess(policy.getProcess().getId());
            assertThat(alerts.getPolicies()).hasSize(0);
        }

        @Nested
        class Disclosure {

            @Test
            void noAlerts() {
                var discReq = createDiscReq().withLegalBases(List.of(createLegalBasisRequest()));
                var disc = disclosureService.save(discReq);

                DisclosureAlert alert = alertService.checkAlertsForDisclosure(disc.getId());
                assertThat(alert.getDisclosureId()).isEqualTo(disc.getId());
                assertThat(alert.isMissingArt6()).isFalse();
            }

            @Test
            void hasArt6() {
                var disc = disclosureService.save(createDiscReq());

                DisclosureAlert alert = alertService.checkAlertsForDisclosure(disc.getId());
                assertThat(alert.getDisclosureId()).isEqualTo(disc.getId());
                assertThat(alert.isMissingArt6()).isTrue();
            }
        }
    }

    private DisclosureRequest createDiscReq() {
        return DisclosureRequest
                .builder()
                .name("disc1")
                .description("newdisclosure")
                .recipient("SKATT")
                .recipientPurpose("AAP")
                .confidentialityDescription("Test Aheve")
                .assessedConfidentiality(true)
                .build();
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
            assertThat(alertEvent.getType()).isEqualTo(AlertEventType.MISSING_ARTICLE_6);
            assertThat(alertEvent.getLevel()).isEqualTo(alertEvent.getType().getLevel());
        }

        @Test
        void processAlertNoEvents() {
            var policy = createProcessWithOnePolicy();
            alertService.calculateEventsForProcess(policy.getProcess().getId());
            var events = alertRepository.findByProcessId(policy.getProcess().getId());
            assertThat(events).isEmpty();
        }

        @Test
        void deleteOldAlerts() {
            processAlertEvents();
            var policy = policyRepository.findAll().get(0);
            policy.getData().setLegalBases(List.of(createLegalBasis()));
            policyRepository.save(policy);

            alertService.calculateEventsForProcess(policy.getProcess().getId());
            var events = alertRepository.findByProcessId(policy.getProcess().getId());
            assertThat(events).isEmpty();
        }

        @Test
        void usesInfoAllInfoTypes() {
            Policy policy = createProcessWithOnePolicy();
            Process process = policy.getProcess();
            process.getData().setUsesAllInformationTypes(true);
            processRepository.save(process);

            // check no duplicates
            alertService.calculateEventsForProcess(process.getId());
            alertService.calculateEventsForProcess(process.getId());
            transactionTemplate.execute(status -> {
                alertService.calculateEventsForPolicy(policyRepository.findById(policy.getId()).orElseThrow());
                alertService.calculateEventsForPolicy(policyRepository.findById(policy.getId()).orElseThrow());
                return null;
            });
            alertService.calculateEventsForInforamtionType(policy.getInformationTypeId());
            alertService.calculateEventsForInforamtionType(policy.getInformationTypeId());

            var events = alertRepository.findByProcessId(process.getId());
            assertThat(events).hasSize(1);
        }

        @Nested
        class Disclosure {

            @Test
            void noDiscEvents() {
                var discReq = createDiscReq().withLegalBases(List.of(createLegalBasisRequest()));
                var disc = disclosureService.save(discReq);

                var events = alertRepository.findByDisclosureId(disc.getId());
                assertThat(events).isEmpty();
            }

            @Test
            void noArt6() {
                var disc = disclosureService.save(createDiscReq());
                var events = alertRepository.findByDisclosureId(disc.getId());
                assertThat(events).hasSize(1);
            }
        }

        @Nested
        class Controller {

            AlertEvent alertEvent1 = new AlertEvent(randomUUID(), randomUUID(), AlertEventType.MISSING_ARTICLE_6);
            AlertEvent alertEvent2 = new AlertEvent(alertEvent1.getProcessId(), alertEvent1.getInformationTypeId(), AlertEventType.MISSING_ARTICLE_6);
            AlertEvent alertEvent3 = new AlertEvent(alertEvent1.getProcessId(), alertEvent1.getInformationTypeId(), AlertEventType.MISSING_ARTICLE_6);
            AlertEvent alertEvent4 = new AlertEvent(randomUUID(), randomUUID(), AlertEventType.MISSING_LEGAL_BASIS);
            AlertEvent alertEvent5 = new AlertEvent(randomUUID(), randomUUID(), AlertEventType.MISSING_ARTICLE_6);

            @BeforeEach
            void setUp() {
                alertRepository.saveAll(convert(List.of(alertEvent1, alertEvent2, alertEvent3, alertEvent4, alertEvent5), GenericStorage::new));
            }

            @ParameterizedTest
            @EnumSource(AlertSort.class)
            void getEventsWithAllParams(AlertSort sort) throws InterruptedException {
                GenericStorage alert = new GenericStorage(
                        new AlertEvent(alertEvent1.getProcessId(), alertEvent1.getInformationTypeId(), AlertEventType.MISSING_ARTICLE_6));
                Thread.sleep(1000);
                saveProcesses(alertEvent1.getProcessId(), alertEvent4.getProcessId(), alertEvent5.getProcessId());
                saveInfoTypes(alertEvent1.getInformationTypeId(), alertEvent4.getInformationTypeId(), alertEvent5.getInformationTypeId());
                alertRepository.save(alert);

                ResponseEntity<EventPage> eventsResponse = restTemplate
                        .getForEntity("/alert/events"
                                        + "?processId={processId}"
                                        + "&informationTypeId={informationTypeId}"
                                        + "&type={type}"
                                        + "&level={level}"
                                        + "&pageSize={pageSize}"
                                        + "&page={page}"
                                        + "&sort={sort}"
                                        + "&dir=DESC",
                                EventPage.class,
                                alertEvent1.getProcessId(), alertEvent1.getInformationTypeId(),
                                AlertEventType.MISSING_ARTICLE_6, AlertEventType.MISSING_ARTICLE_6.getLevel(),
                                2, 0, sort);

                assertThat(eventsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(eventsResponse.getBody()).isNotNull();
                assertThat(eventsResponse.getBody().getContent()).hasSize(2);
                assertThat(eventsResponse.getBody().getTotalElements()).isEqualTo(4L);
            }

            private void saveProcesses(UUID... ids) {
                for (UUID id : ids) {
                    processRepository
                            .save(Process.builder().id(id)
                                    .data(ProcessData.builder().purpose("AAP").name("a name").start(LocalDate.now()).end(LocalDate.now()).build())
                                    .build());
                }
            }

            private void saveInfoTypes(UUID... ids) {
                for (UUID id : ids) {
                    informationTypeRepository.save(InformationType.builder().id(id).data(InformationTypeData.builder().name("a name").build()).build());
                }
            }

            @Test
            void getEventsWithoutParams() {
                ResponseEntity<EventPage> eventsResponse = restTemplate.getForEntity("/alert/events", EventPage.class);

                assertThat(eventsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
                assertThat(eventsResponse.getBody()).isNotNull();
                assertThat(eventsResponse.getBody().getContent()).hasSize(5);
            }
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
        process.getData().setLegalBases(List.of());
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
