package no.nav.data.common.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig {

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
                        .allowedOrigins(securityProperties.getRedirectUris().toArray(new String[]{}))
                        .allowCredentials(true);

            }
        };
    }
}
