package no.nav.data.polly.common.security;

import com.microsoft.aad.msal4j.ClientCredentialFactory;
import com.microsoft.aad.msal4j.ConfidentialClientApplication;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.util.DefaultResourceRetriever;
import com.nimbusds.jose.util.ResourceRetriever;
import no.nav.data.polly.common.security.dto.AADAuthenticationProperties;
import no.nav.data.polly.common.utils.MdcExecutor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.MalformedURLException;

@Configuration
public class SecurityConfig {

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
                .executorService(msalExecutorService())
                .build();
    }

    @Bean
    public MdcExecutor msalExecutorService() {
        return MdcExecutor.newThreadPool(5, "msal");
    }

    @Bean
    public AppIdMapping appIdMapping(SecurityProperties securityProperties) {
        return new AppIdMapping(securityProperties.getAllowedAppIdMappings());
    }

    @Bean
    public Encryptor encryptor(SecurityProperties securityProperties) {
        return new Encryptor(securityProperties.getEncKey());
    }

    @Bean
    public WebMvcConfigurer corsConfigurer(SecurityProperties securityProperties) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/login/**")
                        .allowedOrigins("*");
                registry.addMapping("/**")
                        .allowedOrigins(securityProperties.getCorsOrigins().toArray(new String[]{}))
                        .allowCredentials(true);

            }
        };
    }
}
