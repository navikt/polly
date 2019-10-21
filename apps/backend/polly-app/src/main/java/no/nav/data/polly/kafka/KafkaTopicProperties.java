package no.nav.data.polly.kafka;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties("kafka.topics")
public class KafkaTopicProperties {

    private String behandlingsgrunnlag;
}
