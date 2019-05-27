package no.nav.data.catalog.backend.test.integration;

import no.nav.data.catalog.backend.app.AppStarter;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackageClasses = {AppStarter.class, IntegrationTestConfig.class})
public class IntegrationTestConfig {
}
