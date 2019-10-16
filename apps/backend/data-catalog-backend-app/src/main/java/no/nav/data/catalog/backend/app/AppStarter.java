package no.nav.data.catalog.backend.app;

import com.microsoft.azure.spring.autoconfigure.aad.AADOAuth2AutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {AADOAuth2AutoConfiguration.class})
public class AppStarter {

    public static void main(String[] args) {
        SpringApplication.run(AppStarter.class, args);
    }
}
