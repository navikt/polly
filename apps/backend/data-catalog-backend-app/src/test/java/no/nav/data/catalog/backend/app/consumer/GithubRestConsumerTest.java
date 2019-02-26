package no.nav.data.catalog.backend.app.consumer;

import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.Test;
import org.springframework.web.client.RestTemplate;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class GithubRestConsumerTest {

    private RestTemplate restTemplate = new RestTemplate();

    private GithubRestConsumer githubRestConsumer = new GithubRestConsumer(restTemplate);


    @Test
    public void getFileInfo() {
        GithubFileInfo fileInfo = githubRestConsumer.getFileInfo("nyttDatasett.json");
        byte[] content = fileInfo.getContent().getBytes();
        byte[] decodeCntent = Base64.decodeBase64(content);
        assertThat(fileInfo.getName(), is("nyttDatasett.json"));
    }
}