package no.nav.data.catalog.backend.test.component;

import no.nav.data.catalog.backend.app.consumer.GithubRestConsumer;
import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import no.nav.data.catalog.backend.app.record.RecordService;
import no.nav.data.catalog.backend.app.service.ProcessInformationDatasetService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Collectors;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ProcessInformationDatasetServiceTest {
    private final String FILENAME = "files/InformationTypes.json";

    private GithubRestConsumer githubRestConsumer = mock(GithubRestConsumer.class);
    private RecordService recordService = mock(RecordService.class);
    private ProcessInformationDatasetService service = new ProcessInformationDatasetService(githubRestConsumer, recordService);
    String json;

    @Before
    public void setUp() throws URISyntaxException, IOException {
        ClassLoader loader = ClassLoader.getSystemClassLoader();
        json = Files.lines(Paths.get(loader.getResource(FILENAME).toURI()))
                .parallel()
                .collect(Collectors.joining());
    }

    @Test
    public void retrieveAndSaveDataset() {
        GithubFileInfo inputFileInfo = new GithubFileInfo(FILENAME, "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", new String(Base64.encodeBase64(json.getBytes()), StandardCharsets.UTF_8), "base64");
        when(githubRestConsumer.getFileInfo(anyString(), anyString())).thenReturn(inputFileInfo);
        service.retrieveAndSaveDataset(FILENAME);
    }
}
