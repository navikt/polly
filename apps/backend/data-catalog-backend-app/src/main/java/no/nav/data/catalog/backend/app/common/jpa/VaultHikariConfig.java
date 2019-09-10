package no.nav.data.catalog.backend.app.common.jpa;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.vault.config.databases.VaultDatabaseProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.vault.core.VaultOperations;
import org.springframework.vault.core.lease.LeaseEndpoints;
import org.springframework.vault.core.lease.SecretLeaseContainer;
import org.springframework.vault.support.VaultResponse;

import java.time.Instant;
import java.util.Map;

@Slf4j
@Configuration
@ConditionalOnProperty(value = "spring.cloud.vault.enabled", matchIfMissing = true)
public class VaultHikariConfig implements InitializingBean {

    private final SecretLeaseContainer container;
    private final VaultOperations vaultOperations;
    private final HikariDataSource ds;
    private final VaultDatabaseProperties props;
    private TaskScheduler scheduler;

    public VaultHikariConfig(SecretLeaseContainer container, VaultOperations vaultOperations,
            HikariDataSource ds, VaultDatabaseProperties props, TaskScheduler scheduler) {
        this.container = container;
        this.vaultOperations = vaultOperations;
        this.ds = ds;
        this.props = props;
        this.scheduler = scheduler;
    }

    @Override
    public void afterPropertiesSet() {
        container.setLeaseEndpoints(LeaseEndpoints.SysLeases);
        scheduleNextRotation(0);
    }

    private void rotate() {
        int tries = 0;
        while (tries++ < 10) {
            try {
                String path = getPath();
                log.info("Roterer brukernavn/passord for: {}", path);
                VaultResponse vaultResponse = vaultOperations.read(path);
                updateCredentials(vaultResponse);
                scheduleNextRotation(vaultResponse.getLeaseDuration());
                return;
            } catch (Exception e) {
                log.error("error rotating db credentials", e);
                try {
                    Thread.sleep(1000L * (tries * tries));
                } catch (InterruptedException ex) {
                    log.warn("sleepinterruped", ex);
                }
            }
        }
        log.error("Failed getting database credentials");
    }

    private void updateCredentials(VaultResponse vaultResponse) {
        Map<String, Object> data = vaultResponse.getData();
        val username = data.get("username").toString();
        val password = data.get("password").toString();
        ds.setUsername(username);
        ds.setPassword(password);
    }

    private void scheduleNextRotation(long leaseDuration) {
        Instant startTime = Instant.now().plusSeconds(leaseDuration - 30 * 60);
        log.info("Ny lease duration: {}, next: {}", leaseDuration, startTime);
        scheduler.schedule(this::rotate, startTime);
    }

    private String getPath() {
        return String.format("%s/creds/%s", props.getBackend(), props.getRole());
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + " [container=" + container + ", ds=" + ds + ", props=" + props + "]";
    }
}
