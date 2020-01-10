package no.nav.data.polly.common.security;

import no.nav.data.polly.common.security.dto.PollyRole;
import no.nav.data.polly.common.web.CorrelationFilter;
import no.nav.data.polly.common.web.UserFilter;
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
        http.authorizeRequests().antMatchers("/login/**").permitAll();
        http.authorizeRequests().antMatchers("/userinfo").permitAll();
        http.authorizeRequests().antMatchers("/internal/**").permitAll();

        // Swagger ui
        http.authorizeRequests().antMatchers("/swagger*/**").permitAll();
        http.authorizeRequests().antMatchers("/webjars/springfox-swagger-ui/**").permitAll();

        allowGetAndOptions(http,
                "/codelist/**",
                "/informationtype/**",
                "/policy/**",
                "/process/**",
                "/term/**",
                "/team/**",
                "/disclosure/**",
                "/document/**"
        );

        http.authorizeRequests().antMatchers("/logout/**").authenticated();
        http.authorizeRequests().antMatchers("/codelist/**").hasRole(PollyRole.POLLY_ADMIN.name());
        http.authorizeRequests().antMatchers("/audit/**").hasRole(PollyRole.POLLY_ADMIN.name());
        http.authorizeRequests().anyRequest().hasRole(PollyRole.POLLY_WRITE.name());
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
