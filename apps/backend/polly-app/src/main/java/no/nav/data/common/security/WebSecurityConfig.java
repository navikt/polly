package no.nav.data.common.security;

import no.nav.data.common.security.azure.AADStatelessAuthenticationFilter;
import no.nav.data.common.security.dto.AppRole;
import no.nav.data.common.web.UserFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableGlobalMethodSecurity(prePostEnabled = true, jsr250Enabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

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

        adminOrSuperOnly(http,
                "/process/revision/**"
        );

        http.authorizeRequests().antMatchers("/logout").authenticated();
        http.authorizeRequests().anyRequest().hasRole(AppRole.WRITE.name());
    }

    private void adminOnly(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeRequests().antMatchers(path).hasRole(AppRole.ADMIN.name());
        }
    }

    private void adminOrSuperOnly(HttpSecurity http, String... paths) throws Exception {
        for (String path : paths) {
            http.authorizeRequests().antMatchers(path).hasAnyRole(AppRole.ADMIN.name(), AppRole.SUPER.name());
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
        // In lightweight mvc tests where authfilter isnt initialized
        if (aadAuthFilter != null) {
            http.addFilterBefore(aadAuthFilter, UsernamePasswordAuthenticationFilter.class);
        }
        http.addFilterAfter(userFilter, UsernamePasswordAuthenticationFilter.class);
    }

}
