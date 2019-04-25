//package no.nav.data.catalog.backend.test.component;
//
//import no.nav.data.catalog.backend.app.github.GithubConsumer;
//import no.nav.data.catalog.backend.app.github.GithubService;
//import no.nav.data.catalog.backend.app.github.domain.GithubFile;
//import no.nav.data.catalog.backend.app.record.RecordService;
//import org.apache.commons.codec.binary.Base64;
//import org.junit.Rule;
//import org.junit.Test;
//import org.junit.rules.ExpectedException;
//import org.junit.runner.RunWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.context.junit4.SpringRunner;
//
//import java.io.InputStream;
//
//import static org.mockito.ArgumentMatchers.anyString;
//import static org.mockito.Mockito.*;
//
//@RunWith(SpringRunner.class)
//@SpringBootTest(classes = ComponentTestConfig.class)
//@ActiveProfiles("test")
//public class GithubServiceTest {
//
//    @Mock
//    private GithubConsumer consumerMock;
//
//    @Mock
//    private RecordService recordService;
//
//    @InjectMocks
//    private GithubService service;
//
//    @Rule
//    public ExpectedException expectedException = ExpectedException.none();
//
//    @Test
//    public void getSingleRecords()  throws Exception{
//        byte[] content;
//        InputStream in = getClass().getResourceAsStream("/files/InformationType.json");
//        content = in.readAllBytes();
//
//        when(consumerMock.getFile(anyString())).thenReturn(new GithubFile("filename.json", "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", Base64.encodeBase64String(content), "base64"));
//        service.handle("testdataIkkeSlett/singleRow.json");
//        //Give elasticsearch a few seconds to index documents
//        verify(recordService, times(1)).insertRecord(anyString());
//    }
//
//    @Test
//    public void getMultipleRecords() throws Exception {
//        byte[] content;
//        InputStream in = getClass().getResourceAsStream("/files/InformationTypes.json");
//        content = in.readAllBytes();
//
//        when(consumerMock.getFile(anyString())).thenReturn(new GithubFile("filename.json", "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", Base64.encodeBase64String(content), "base64"));
//        service.handle("testdataIkkeSlett/multipleRows.json");
//        verify(recordService, times(6)).insertRecord(anyString());
//    }
//
//    @Test
//    public void getRecordNotAFile()  throws Exception{
//        byte[] content;
//        InputStream in = getClass().getResourceAsStream("/files/InformationTypes.json");
//        content = in.readAllBytes();
//
//        when(consumerMock.getFile(anyString())).thenReturn(new GithubFile("filename.json", "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "directory", Base64.encodeBase64String(content), "base64"));
//        service.handle("testdataIkkeSlett/singleRow.json");
//        //Give elasticsearch a few seconds to index documents
//        verify(recordService, times(0)).insertRecord(anyString());
//    }
//
//    @Test
//    public void getRecordNotBase64Encoded()  throws Exception{
//        byte[] content;
//        InputStream in = getClass().getResourceAsStream("/files/InformationTypes.json");
//        content = in.readAllBytes();
//
//        when(consumerMock.getFile(anyString())).thenReturn(new GithubFile("filename.json", "filpath", "sha", 1L, "url", "html_url", "git_url", "download_url", "file", Base64.encodeBase64String(content), "whaat"));
//        service.handle("testdataIkkeSlett/singleRow.json");
//        //Give elasticsearch a few seconds to index documents
//        verify(recordService, times(0)).insertRecord(anyString());
//    }
//}
