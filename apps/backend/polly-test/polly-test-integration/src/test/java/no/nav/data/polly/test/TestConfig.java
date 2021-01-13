package no.nav.data.polly.test;

import com.nimbusds.oauth2.sdk.id.Issuer;
import com.nimbusds.openid.connect.sdk.SubjectType;
import com.nimbusds.openid.connect.sdk.op.OIDCProviderMetadata;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.security.AppIdMapping;
import no.nav.data.common.security.azure.AADAuthenticationProperties;
import no.nav.data.common.security.azure.AADStatelessAuthenticationFilter;
import no.nav.data.common.security.azure.AzureUserInfo;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.client.DefaultResponseErrorHandler;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.Charset;
import java.util.List;
import java.util.Optional;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Configuration
public class TestConfig {

    @Bean
    public ApplicationRunner testRestTemplate(TestRestTemplate testRestTemplate) {
        return (args) -> {
            testRestTemplate.getRestTemplate().setRequestFactory(new BufferingClientHttpRequestFactory(testRestTemplate.getRestTemplate().getRequestFactory()));
            testRestTemplate.getRestTemplate().setErrorHandler(new DefaultResponseErrorHandler() {
                @Override
                public void handleError(ClientHttpResponse response, HttpStatus statusCode) {
                    log.error(new String(getResponseBody(response), Optional.ofNullable(getCharset(response)).orElse(Charset.defaultCharset())));
                }
            });
        };
    }

    @Bean
    public AADStatelessAuthenticationFilter aadStatelessAuthenticationFilter() throws URISyntaxException {
        return new MockFilter();
    }

    public static class MockFilter extends AADStatelessAuthenticationFilter {

        private static AzureUserInfo user;

        public MockFilter() throws URISyntaxException {
            super(null, null, new AppIdMapping("[]", ""), new AADAuthenticationProperties(),
                    null, new OIDCProviderMetadata(new Issuer("issuer"), List.of(SubjectType.PUBLIC), new URI("http://localhost")));
        }

        public static void setUser(AzureUserInfo user) {
            MockFilter.user = user;
        }

        public static void clearUser() {
            setUser(null);
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
            try {
                if (user != null) {
                    PreAuthenticatedAuthenticationToken auth = new PreAuthenticatedAuthenticationToken(null, null);
                    auth.setAuthenticated(true);
                    auth.setDetails(user);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
                filterChain.doFilter(request, response);
            } finally {
                SecurityContextHolder.clearContext();
            }
        }
    }
}
