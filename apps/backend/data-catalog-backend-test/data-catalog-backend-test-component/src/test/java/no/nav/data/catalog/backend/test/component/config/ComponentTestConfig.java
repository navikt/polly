package no.nav.data.catalog.backend.test.component.config;

import no.nav.data.catalog.backend.app.AppStarter;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(AppStarter.class)
@EntityScan("no.nav.data.catalog.backend")
@ComponentScan("no.nav.data.catalog.backend")
public class ComponentTestConfig {
}
