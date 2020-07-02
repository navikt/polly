package no.nav.data.common.security;

import no.nav.data.common.security.azure.AADStatelessAuthenticationFilter;
import no.nav.data.common.security.dto.PollyRole;
import no.nav.data.common.web.CorrelationFilter;
import no.nav.data.common.web.UserFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;

@EnableGlobalMethodSecurity(prePostEnabled = true, jsr250Enabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final CorrelationFilter correlationFilter = new CorrelationFilter();
    private final UserFilter userFilter = new UserFilter();

    @Autowired(required = false)
    private AADStatelessAuthenticationFilter aadAuthFilter;
    @Autowired(required = false)
    private SecurityProperties securityProperties;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .logout().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        addFilters(http);

        if (securityProperties == null || !securityProperties.isEnabled()) {
            return;
        }

        allowAll(http,
                "/login/**",
                "/userinfo",
                "/internal/**",
                "/swagger*/**",
                "/webjars/springfox-swagger-ui/**"
        );

        allowGetAndOptions(http,
                "/codelist/**",
                "/informationtype/**",
                "/policy/**",
                "/process/**",
                "/term/**",
                "/team/**",
                "/disclosure/**",
                "/document/**",
                "/settings/**",
                "/event/**",
                "/alert/**",
                "/export/**",
                "/dash/**"
        );

        adminOnly(http,
                "/codelist/**",
                "/audit/**",
                "/settings/**"
        );

        http.authorizeRequests().antMatchers("/logout/**").authenticated();
        http.authorizeRequests().anyRequest().hasRole(PollyRole.POLLY_WRITE.name());
    }

    private void adminOnly(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeRequests().antMatchers(path).hasRole(PollyRole.POLLY_ADMIN.name());
        }
    }

    private void allowAll(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeRequests().antMatchers(path).permitAll();
        }
    }

    private void allowGetAndOptions(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeRequests().antMatchers(HttpMethod.GET, path).permitAll();
            http.authorizeRequests().antMatchers(HttpMethod.OPTIONS, path).permitAll();
        }
    }

    private void addFilters(HttpSecurity http) {
        http.addFilterBefore(correlationFilter, SecurityContextPersistenceFilter.class);
        // In lightweight mvc tests where authfilter isnt initialized
        if (aadAuthFilter != null) {
            http.addFilterBefore(aadAuthFilter, UsernamePasswordAuthenticationFilter.class);
            http.addFilterAfter(userFilter, AADStatelessAuthenticationFilter.class);
        } else {
            http.addFilterAfter(userFilter, UsernamePasswordAuthenticationFilter.class);
        }
    }

}
