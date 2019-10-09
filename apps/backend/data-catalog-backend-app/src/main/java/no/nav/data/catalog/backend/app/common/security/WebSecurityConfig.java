package no.nav.data.catalog.backend.app.common.security;

import com.microsoft.azure.spring.autoconfigure.aad.AADAppRoleStatelessAuthenticationFilter;
import no.nav.data.catalog.backend.app.common.web.CorrelationFilter;
import no.nav.data.catalog.backend.app.common.web.UserFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextPersistenceFilter;

@EnableGlobalMethodSecurity(prePostEnabled = true, jsr250Enabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired(required = false)
    private AADAppRoleStatelessAuthenticationFilter aadAuthFilter;
    @Value("${security.enabled:true}")
    private boolean enable;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(new CorrelationFilter(), SecurityContextPersistenceFilter.class);

        if (!enable) {
            http.addFilterAfter(new UserFilter(), CorrelationFilter.class);
            return;
        }
        http.authorizeRequests().antMatchers("/internal/**").permitAll();

        // Swagger ui
        http.authorizeRequests().antMatchers("/swagger*/**").permitAll();
        http.authorizeRequests().antMatchers("/webjars/springfox-swagger-ui/**").permitAll();

        // Verified by github signature
        http.authorizeRequests().antMatchers("/webhooks/**").permitAll();

        http.authorizeRequests().antMatchers(HttpMethod.GET, "/dataset/**").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/codelist/**").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/distributionchannel/**").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/system/**").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/records/search").permitAll();

        http.authorizeRequests().anyRequest().authenticated();

        http.addFilterBefore(aadAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterAfter(new UserFilter(), AADAppRoleStatelessAuthenticationFilter.class);
    }

}
