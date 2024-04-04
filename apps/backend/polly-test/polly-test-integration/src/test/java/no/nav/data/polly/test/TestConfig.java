package no.nav.data.polly.test;

import com.nimbusds.oauth2.sdk.id.Issuer;
import com.nimbusds.openid.connect.sdk.SubjectType;
import com.nimbusds.openid.connect.sdk.op.OIDCProviderMetadata;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import no.nav.data.common.security.AppIdMapping;
import no.nav.data.common.security.azure.AADAuthenticationProperties;
import no.nav.data.common.security.azure.AADStatelessAuthenticationFilter;
import no.nav.data.common.security.azure.AzureUserInfo;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;

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
}
