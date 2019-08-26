package no.nav.data.catalog.backend.app.common.security;

import com.microsoft.azure.spring.autoconfigure.aad.AADAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired(required = false)
    private AADAuthenticationFilter aadAuthFilter;
    @Value("${security.enabled}")
    private Boolean enable;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();

        if (enable != null && !enable) {
            return;
        }
        http.authorizeRequests().antMatchers("/internal/**").permitAll();

        // Swagger ui
        http.authorizeRequests().antMatchers("/swagger*/**").permitAll();
        http.authorizeRequests().antMatchers("/webjars/springfox-swagger-ui/**").permitAll();

        // Verified by github signature
        http.authorizeRequests().antMatchers("/webhooks/**").permitAll();

        http.authorizeRequests().anyRequest().authenticated();

        http.logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/").deleteCookies("JSESSIONID").invalidateHttpSession(true);

        http.addFilterBefore(aadAuthFilter, UsernamePasswordAuthenticationFilter.class);
    }

}
