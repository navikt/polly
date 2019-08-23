package no.nav.data.catalog.backend.app.kafka;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties("kafka.rest")
public class KafkaRestProperties {

    private String adminUrl;
    private String schemaRegistryUrl;
    private String adminApikey;
}
