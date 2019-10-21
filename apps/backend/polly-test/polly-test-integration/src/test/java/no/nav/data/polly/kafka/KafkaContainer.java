package no.nav.data.polly.kafka;

import org.springframework.util.SocketUtils;

public class KafkaContainer extends org.testcontainers.containers.KafkaContainer {

    public static final int PORT = SocketUtils.findAvailableTcpPort();

    public KafkaContainer(String confluentVersion) {
        super(confluentVersion);
        addFixedExposedPort(PORT, KAFKA_PORT);
    }

    public static String getAddress() {
        return "PLAINTEXT://localhost:" + PORT;
    }
}
