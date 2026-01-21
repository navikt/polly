package no.nav.data.common.jpa;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Configuration;

import static java.util.concurrent.TimeUnit.MINUTES;

@Configuration
public class DatasourceConfig {

    static HikariDataSource hikariDataSource(String url, String username, String password) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setMinimumIdle(1);
        config.setMaximumPoolSize(2);
        config.setIdleTimeout(MINUTES.toMillis(5));
        config.setMaxLifetime(MINUTES.toMillis(9));
        config.setUsername(username);
        config.setPassword(password);
        return new HikariDataSource(config);
    }

}
