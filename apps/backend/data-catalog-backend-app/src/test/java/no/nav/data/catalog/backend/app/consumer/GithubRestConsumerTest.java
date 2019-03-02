package no.nav.data.catalog.backend.app.consumer;

import no.nav.data.catalog.backend.app.common.tokensupport.JwtTokenGenerator;
import no.nav.data.catalog.backend.app.domain.GithubFileInfo;
import org.apache.tomcat.util.codec.binary.Base64;
import org.junit.Test;
import org.springframework.web.client.RestTemplate;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

public class GithubRestConsumerTest {

    private RestTemplate restTemplate = new RestTemplate();

    private GithubRestConsumer githubRestConsumer = new GithubRestConsumer(restTemplate);

    private JwtTokenGenerator tokenGenerator = new JwtTokenGenerator();

    @Test
    public void getFileInfo() {
        String jwtToken = tokenGenerator.generateToken("C:\\Visma\\projects\\nav\\data-catalog-backend\\travis\\datajegerne-private-key.pem");
        String installationId = githubRestConsumer.getInstallationId(jwtToken);
        String token = githubRestConsumer.getInstallationToken(installationId, jwtToken);
        GithubFileInfo fileInfo = githubRestConsumer.getFileInfo("nyttDatasett.json", token);
        byte[] content = fileInfo.getContent().getBytes();
        byte[] decodeCntent = Base64.decodeBase64(content);
        assertThat(fileInfo.getName(), is("nyttDatasett.json"));
    }

    @Test
    public void getInstallationId() {
        String jwtToken = tokenGenerator.generateToken("C:\\Visma\\projects\\nav\\data-catalog-backend\\travis\\datajegerne-private-key.pem");
        String installationId = githubRestConsumer.getInstallationId(jwtToken);
    }

    @Test
    public void getInstallationToken() {
        String jwtToken = tokenGenerator.generateToken("C:\\Visma\\projects\\nav\\data-catalog-backend\\travis\\datajegerne-private-key.pem");
        String installationId = githubRestConsumer.getInstallationId(jwtToken);
        String token = githubRestConsumer.getInstallationToken(installationId, jwtToken);
    }


}