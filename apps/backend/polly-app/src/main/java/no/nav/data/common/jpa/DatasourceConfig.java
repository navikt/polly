package no.nav.data.common.jpa;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import static java.util.concurrent.TimeUnit.MINUTES;

@Configuration
public class DatasourceConfig {

    static HikariDataSource hikariDataSource(
            @Value("${spring.datasource.url}") String url,
            @Value("${spring.datasource.username}") String username,
            @Value("${spring.datasource.password}") String password) {
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
