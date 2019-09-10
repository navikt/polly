package no.nav.data.catalog.backend.app.common.jpa;

import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.flyway.FlywayConfigurationCustomizer;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.cloud.vault.config.databases.VaultDatabaseProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.vault.core.VaultOperations;
import org.springframework.vault.support.VaultResponse;

import java.util.Map;

import static java.lang.String.format;

@Slf4j
@Configuration
@ConditionalOnProperty(value = "spring.cloud.vault.enabled", matchIfMissing = true)
public class FlywayConfig {

    @Bean
    public FlywayConfigurationCustomizer flywayConfigurationCustomizer(
            VaultOperations vaultOperations,
            VaultDatabaseProperties vaultDatabaseProperties,
            DataSourceProperties dataSourceProperties
    ) {
        return configuration -> {
            String userRole = vaultDatabaseProperties.getRole();
            String backend = vaultDatabaseProperties.getBackend();
            String adminRole = userRole.replace("-user", "-admin");
            String secretPath = format("%s/creds/%s", backend, adminRole);

            VaultResponse vaultResponse = vaultOperations.read(secretPath);
            Map<String, Object> data = vaultResponse.getData();
            val username = data.get("username").toString();
            val password = data.get("password").toString();

            log.info("Vault: Flyway configured with credentials from Vault. Credential path: {}", secretPath);

            configuration
                    .dataSource(dataSourceProperties.getUrl(), username, password)
                    .initSql(String.format("SET ROLE \"%s\"", adminRole));
        };
    }
}
