package no.nav.polly.common.security;

import com.microsoft.aad.adal4j.AuthenticationContext;
import com.microsoft.azure.spring.autoconfigure.aad.AADAuthenticationProperties;
import com.microsoft.azure.spring.autoconfigure.aad.ServiceEndpoints;
import com.microsoft.azure.spring.autoconfigure.aad.ServiceEndpointsProperties;
import com.microsoft.azure.spring.autoconfigure.aad.UserPrincipalManager;
import com.nimbusds.jose.util.DefaultResourceRetriever;
import com.nimbusds.jose.util.ResourceRetriever;
import no.nav.polly.common.utils.MdcExecutor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;
import java.net.Proxy;

@Configuration
public class SecurityConfig {

    @Bean
    public ResourceRetriever resourceRetriever(Proxy proxy, AADAuthenticationProperties aadAuthProps) {
        DefaultResourceRetriever resourceRetriever =
                new DefaultResourceRetriever(aadAuthProps.getJwtConnectTimeout(), aadAuthProps.getJwtReadTimeout(), aadAuthProps.getJwtSizeLimit());
        resourceRetriever.setProxy(proxy);
        return resourceRetriever;
    }

    @Bean
    public UserPrincipalManager userPrincipalManager(
            ResourceRetriever resourceRetriever, AADAuthenticationProperties aadAuthProps, ServiceEndpointsProperties serviceEndpointsProps) {
        boolean useExplicitAudienceCheck = true;
        return new UserPrincipalManager(serviceEndpointsProps, aadAuthProps, resourceRetriever, useExplicitAudienceCheck);
    }

    @Bean
    public AADStatelessAuthenticationFilter aadStatelessAuthenticationFilter(UserPrincipalManager userPrincipalManager, AzureTokenProvider azureTokenProvider, AppIdMapping appIdMapping) {
        return new AADStatelessAuthenticationFilter(userPrincipalManager, azureTokenProvider, appIdMapping);
    }

    @Bean
    public AuthenticationContext authenticationContext(Proxy proxy,
            AADAuthenticationProperties aadAuthProps, ServiceEndpointsProperties serviceEndpointsProps) throws MalformedURLException {
        ServiceEndpoints serviceEndpoints = serviceEndpointsProps.getServiceEndpoints(aadAuthProps.getEnvironment());
        String uri = serviceEndpoints.getAadSigninUri() + aadAuthProps.getTenantId() + "/";
        AuthenticationContext authenticationContext = new AuthenticationContext(uri, true, adalAuthenticationExecutor());
        authenticationContext.setProxy(proxy);
        return authenticationContext;
    }

    @Bean
    public MdcExecutor adalAuthenticationExecutor() {
        return MdcExecutor.newThreadPool(5, "adal");
    }

    @Bean
    public AppIdMapping appIdMapping(@Value("${azure.activedirectory.allowed.app-id.mappings}") String mappings) {
        return new AppIdMapping(mappings);
    }
}
