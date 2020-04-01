package no.nav.data.polly.export;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.domain.ProcessData;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
public class DocxTest {

    private ProcessToDocx processToDocx = new ProcessToDocx();

    @Test
    void createDocForProcess() throws IOException {
        CodelistStub.initializeCodelist();

        var docx = processToDocx.generateDocForProcess(createProcess());

        Path tempFile = Files.createTempFile("process", ".docx");
        Files.write(tempFile, docx);
        log.info("Written to {}", tempFile.toAbsolutePath());
    }

    private Process createProcess() {
        return Process.builder()
                .generateId()
                .name("Saksbehandling")
                .purposeCode("AAP")
                .data(ProcessData.builder()

                        .build())

                .build();
    }
}
