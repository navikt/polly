package no.nav.data.polly.test;

import com.nimbusds.oauth2.sdk.id.Issuer;
import com.nimbusds.openid.connect.sdk.SubjectType;
import com.nimbusds.openid.connect.sdk.op.OIDCProviderMetadata;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import no.nav.data.common.mail.EmailProvider;
import no.nav.data.common.mail.MailTask;
import no.nav.data.common.security.AppIdMapping;
import no.nav.data.common.security.azure.AADAuthenticationProperties;
import no.nav.data.common.security.azure.AADStatelessAuthenticationFilter;
import no.nav.data.common.security.azure.AzureTokenConsumer;
import no.nav.data.common.security.azure.AzureUserInfo;
import no.nav.data.common.security.TokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Configuration
public class TestConfig {

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

    @Bean
    @Primary
    public EmailProvider emailProvider() {
        // No-op provider for tests
        return mailTask -> {
        };
    }

    @Bean
    @Primary
    public TokenProvider tokenProvider() {
        return new TokenProvider() {
            @Override
            public String createSession(String sessionId, String code, String fullRequestUrlWithoutQuery) {
                return "test-session";
            }

            @Override
            public void destroySession() {
                // no-op
            }

            @Override
            public String createAuthRequestRedirectUrl(String postLoginRedirectUri, String postLoginErrorUri, String redirectUri) {
                return redirectUri;
            }

            @Override
            public String getConsumerToken(String resource) {
                return "Bearer test-token";
            }
        };
    }

    @Bean
    @Primary
    public AzureTokenConsumer azureTokenConsumer() {
        return new AzureTokenConsumer(new RestTemplate()) {
            @Override
            public String getToken(String scope) {
                return "dummy-token";
            }
        };
    }
}
