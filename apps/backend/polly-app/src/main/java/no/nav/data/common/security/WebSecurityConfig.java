package no.nav.data.common.security;

import no.nav.data.common.security.azure.AADStatelessAuthenticationFilter;
import no.nav.data.common.security.dto.AppRole;
import no.nav.data.common.web.UserFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity(jsr250Enabled = true)
public class WebSecurityConfig {

    private final UserFilter userFilter = new UserFilter();

    private AADStatelessAuthenticationFilter aadAuthFilter;
    private SecurityProperties securityProperties;

    @Autowired
    public WebSecurityConfig(AADStatelessAuthenticationFilter aadAuthFilter, SecurityProperties securityProperties) {
        this.aadAuthFilter = aadAuthFilter;
        this.securityProperties = securityProperties;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .sessionManagement(httpSecuritySessionManagementConfigurer -> httpSecuritySessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        addFilters(http);

        if (securityProperties == null || !securityProperties.isEnabled()) {
            return http.build();
        }

        allowAll(http,
                "/error",
                "/login",
                "/oauth2/callback",
                "/userinfo",
                "/internal/**",
                "/swagger*/**",
                "/process/shortbyid"
        );

        allowGetAndOptions(http,
                "/codelist/**",
                "/informationtype/**",
                "/policy/**",
                "/process/**",
                "/processor/**",
                "/dpprocess/**",
                "/term/**",
                "/aaregavtale/**",
                "/team/**",
                "/disclosure/**",
                "/document/**",
                "/settings/**",
                "/event/**",
                "/alert/**",
                "/export/**",
                "/dash/**",
                "/nom/**"
        );

        adminOnly(http,
                "/codelist/**",
                "/audit/**",
                "/settings/**"
        );

        adminOrSuperOnly(http,
                "/process/revision/**"
        );

        http.authorizeHttpRequests(auth -> auth.requestMatchers("/logout").authenticated());
        http.authorizeHttpRequests(auth -> auth.anyRequest().hasRole(AppRole.WRITE.name()));
        return http.build();
    }

    private void adminOnly(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeHttpRequests(auth -> auth.requestMatchers(path).hasRole(AppRole.ADMIN.name()));
        }
    }

    private void adminOrSuperOnly(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeHttpRequests(auth -> auth.requestMatchers(path).hasAnyRole(AppRole.ADMIN.name(), AppRole.SUPER.name()));
        }
    }

    private void allowAll(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeHttpRequests(auth -> auth.requestMatchers(path).permitAll());
        }
    }

    private void allowGetAndOptions(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.GET, path).permitAll());
            http.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, path).permitAll());
        }
    }

    private void addFilters(HttpSecurity http) {
        // In lightweight mvc tests where authfilter is not initialized
        if (aadAuthFilter != null) {
            http.addFilterBefore(aadAuthFilter, UsernamePasswordAuthenticationFilter.class);
        }
        http.addFilterAfter(userFilter, UsernamePasswordAuthenticationFilter.class);
    }

}
