package no.nav.data.common.security.azure;

import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.util.DefaultResourceRetriever;
import com.nimbusds.jose.util.ResourceRetriever;
import no.nav.data.common.security.AppIdMapping;
import no.nav.data.common.security.dto.AADAuthenticationProperties;
import no.nav.data.common.utils.MdcExecutor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
public class AzureConfig {

    @Bean
    public ResourceRetriever getJWTResourceRetriever() {
        return new DefaultResourceRetriever(RemoteJWKSet.DEFAULT_HTTP_CONNECT_TIMEOUT, RemoteJWKSet.DEFAULT_HTTP_READ_TIMEOUT, RemoteJWKSet.DEFAULT_HTTP_SIZE_LIMIT);
    }

    @Bean
    public AADStatelessAuthenticationFilter aadStatelessAuthenticationFilter(ResourceRetriever resourceRetriever, AADAuthenticationProperties aadAuthProps,
            AzureTokenProvider azureTokenProvider, AppIdMapping appIdMapping) {
        return new AADStatelessAuthenticationFilter(azureTokenProvider, appIdMapping, aadAuthProps, resourceRetriever);
    }

    @Bean
    public ConfidentialClientApplication msalClient(AADAuthenticationProperties aadAuthProps) throws MalformedURLException {
        return ConfidentialClientApplication
                .builder(aadAuthProps.getClientId(), ClientCredentialFactory.createFromSecret(aadAuthProps.getClientSecret()))
                .authority(aadAuthProps.getAadSigninUri() + aadAuthProps.getTenantId())
                .executorService(msalThreadPool())
                .build();
    }

    @Bean
    public ThreadPoolExecutor msalThreadPool() {
        return MdcExecutor.newThreadPool(5, "msal");
    }
}
