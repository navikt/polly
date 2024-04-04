package no.nav.data.common.jpa;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Configuration;

import static java.util.concurrent.TimeUnit.MINUTES;

@Configuration
public class DatasourceConfig {
    static HikariDataSource hikariDataSource(DataSourceProperties properties) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(properties.getUrl());
        config.setMinimumIdle(1);
        config.setMaximumPoolSize(2);
        config.setIdleTimeout(MINUTES.toMillis(5));
        config.setMaxLifetime(MINUTES.toMillis(9));
        config.setUsername(properties.getUsername());
        config.setPassword(properties.getPassword());
        return new HikariDataSource(config);
    }

}
