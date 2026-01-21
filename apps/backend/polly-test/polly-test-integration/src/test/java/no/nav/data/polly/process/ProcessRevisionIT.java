package no.nav.data.polly.process;

import no.nav.data.common.mail.MailTask;
import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.common.storage.domain.StorageType;
import no.nav.data.common.utils.MdcUtils;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import no.nav.data.polly.process.domain.ProcessStatus;
import no.nav.data.polly.process.domain.sub.Affiliation;
import no.nav.data.polly.process.dto.ProcessRevisionRequest;
import no.nav.data.polly.process.dto.ProcessRevisionRequest.ProcessSelection;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ProcessRevisionIT extends IntegrationTestBase {

    ProcessRevisionRequest req = ProcessRevisionRequest.builder()
            .processSelection(ProcessSelection.ALL)
            .revisionText("needs revision")
            .build();

    @Test
    void revisionAll() {
        MdcUtils.setUser("A123456 - Name");
        Process processOne = createProcess();
        createProcess();
        MdcUtils.setUser("A123457 - Name");
        createProcess();

        webTestClient.post()
                .uri("/process/revision")
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk();

        assertThat(processRepository.findById(processOne.getId()).orElseThrow().getData().getStatus()).isEqualTo(ProcessStatus.NEEDS_REVISION);
        assertTasks(2);
    }

    @Test
    void revisionOne() {
        MdcUtils.setUser("A123456 - Name");
        Process processOne = createProcess();
        MdcUtils.setUser("A123457 - Name");
        Process processTwo = createProcess();

        req.setProcessId(processOne.getId());
        req.setProcessSelection(ProcessSelection.ONE);
        webTestClient.post()
                .uri("/process/revision")
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk();

        assertThat(processRepository.findById(processTwo.getId()).orElseThrow().getData().getStatus()).isEqualTo(ProcessStatus.COMPLETED);
        assertTasks(1);
    }

    @Test
    void revisionProductArea() {
        MdcUtils.setUser("A123456 - Name");
        Process processOne = createProcess();
        processOne.getData().setAffiliation(Affiliation.builder().productTeams(List.of("xteamR")).build());
        processRepository.save(processOne);
        MdcUtils.setUser("A123457 - Name");
        Process processTwo = createProcess();

        req.setProductAreaId("productarea1");
        req.setProcessSelection(ProcessSelection.PRODUCT_AREA);

        webTestClient.post()
                .uri("/process/revision")
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk();

        assertThat(processRepository.findById(processOne.getId()).orElseThrow().getData().getStatus()).isEqualTo(ProcessStatus.NEEDS_REVISION);
        assertThat(processRepository.findById(processTwo.getId()).orElseThrow().getData().getStatus()).isEqualTo(ProcessStatus.COMPLETED);
        assertTasks(1);
    }

    @Test
    void revisionDepartment() {
        MdcUtils.setUser("A123456 - Name");
        Process processOne = createProcess();
        processOne.getData().setAffiliation(Affiliation.builder().department("DEP").nomDepartmentId("DEP").nomDepartmentName("dep").build());
        processRepository.save(processOne);
        MdcUtils.setUser("A123457 - Name");
        Process processTwo = createProcess();

        req.setDepartment("DEP");
        req.setProcessSelection(ProcessSelection.DEPARTMENT);

        webTestClient.post()
                .uri("/process/revision")
                .bodyValue(req)
                .exchange()
                .expectStatus().isOk();

        assertThat(processRepository.findById(processOne.getId()).orElseThrow().getData().getStatus()).isEqualTo(ProcessStatus.NEEDS_REVISION);
        assertThat(processRepository.findById(processTwo.getId()).orElseThrow().getData().getStatus()).isEqualTo(ProcessStatus.COMPLETED);
        assertTasks(1);
    }

    private void assertTasks(int expected) {
        List<GenericStorage> tasks = genericStorageRepository.findAllByType(StorageType.MAIL_TASK);
        assertThat(tasks).hasSize(expected);
        tasks.forEach(taskStorage -> {
            MailTask task = taskStorage.getDataObject(MailTask.class);
            assertThat(task.getTo()).isEqualTo("email@norge.no");
            assertThat(task.getSubject()).isNotNull();
            assertThat(task.getBody()).isNotNull();
        });
    }

    private Process createProcess() {
        return processRepository.save(Process.builder()
                .generateId()
                .data(ProcessData.builder()
                        .name("Name")
                        .purpose(PURPOSE_CODE1)
                        .start(LocalDate.now()).end(LocalDate.now())
                        .status(ProcessStatus.COMPLETED)
                        .build())
                .build());
    }
}
