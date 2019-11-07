package no.nav.data.polly.common.security;

import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.azure.spring.autoconfigure.aad.AADAuthenticationProperties;
import com.microsoft.azure.spring.autoconfigure.aad.ServiceEndpoints;
import com.microsoft.azure.spring.autoconfigure.aad.ServiceEndpointsProperties;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipalManager;
import com.nimbusds.jose.util.ResourceRetriever;
import no.nav.data.polly.common.utils.MdcExecutor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;
import java.util.concurrent.ExecutorService;

@Configuration
public class SecurityConfig {

    @Bean
    public AADStatelessAuthenticationFilter aadStatelessAuthenticationFilter(ResourceRetriever resourceRetriever, AADAuthenticationProperties aadAuthProps,
            ServiceEndpointsProperties serviceEndpointsProps, AzureTokenProvider azureTokenProvider, AppIdMapping appIdMapping) {
        var userPrincipalManager = new UserPrincipalManager(serviceEndpointsProps, aadAuthProps, resourceRetriever, true);
        return new AADStatelessAuthenticationFilter(userPrincipalManager, azureTokenProvider, appIdMapping);
    }

    @Bean
    public AuthenticationContext authenticationContext(AADAuthenticationProperties aadAuthProps, ServiceEndpointsProperties serviceEndpointsProps) throws MalformedURLException {
        ServiceEndpoints serviceEndpoints = serviceEndpointsProps.getServiceEndpoints(aadAuthProps.getEnvironment());
        String uri = serviceEndpoints.getAadSigninUri() + aadAuthProps.getTenantId();
        ExecutorService executor = MdcExecutor.newThreadPool(5, "adal");
        return new AuthenticationContext(uri, true, executor);
    }

    @Bean
    public AppIdMapping appIdMapping(@Value("${azure.activedirectory.allowed.app-id.mappings}") String mappings) {
        return new AppIdMapping(mappings);
    }
}
