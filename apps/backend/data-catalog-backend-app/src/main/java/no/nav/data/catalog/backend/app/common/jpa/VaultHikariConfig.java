package no.nav.data.catalog.backend.app.common.jpa;

import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.vault.config.databases.VaultDatabaseProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.vault.core.lease.LeaseEndpoints;
import org.springframework.vault.core.lease.SecretLeaseContainer;
import org.springframework.vault.core.lease.domain.RequestedSecret;
import org.springframework.vault.core.lease.event.SecretLeaseCreatedEvent;

import java.util.Map;

import static org.springframework.vault.core.lease.domain.RequestedSecret.rotating;

@Slf4j
@Configuration
@ConditionalOnProperty(value = "spring.cloud.vault.enabled", matchIfMissing = true)
public class VaultHikariConfig implements InitializingBean {

    private final SecretLeaseContainer container;
    private final HikariDataSource ds;
    private final VaultDatabaseProperties props;

    public VaultHikariConfig(SecretLeaseContainer container, HikariDataSource ds, VaultDatabaseProperties props) {
        this.container = container;
        this.ds = ds;
        this.props = props;
    }

    @Override
    public void afterPropertiesSet() {
        container.setLeaseEndpoints(LeaseEndpoints.SysLeases);
        RequestedSecret secret = rotating(props.getBackend() + "/creds/" + props.getRole());
        container.addLeaseListener(leaseEvent -> {
            if (leaseEvent.getSource() == secret && leaseEvent instanceof SecretLeaseCreatedEvent) {
                log.info("Roterer brukernavn/passord for : {}", leaseEvent.getSource().getPath());
                Map<String, Object> secrets = ((SecretLeaseCreatedEvent) leaseEvent).getSecrets();
                String username = secrets.get("username").toString();
                String password = secrets.get("password").toString();
                ds.setUsername(username);
                ds.setPassword(password);
            }
        });
        container.addRequestedSecret(secret);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + " [container=" + container + ", ds=" + ds + ", props=" + props + "]";
    }
}
