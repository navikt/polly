package no.nav.data.polly.kafka;

import org.springframework.util.SocketUtils;
import org.testcontainers.containers.Network;

public class KafkaContainer extends org.testcontainers.containers.KafkaContainer {

    public static final int PORT = SocketUtils.findAvailableTcpPort();

    public KafkaContainer(String confluentVersion) {
        super(confluentVersion);
        addFixedExposedPort(PORT, KAFKA_PORT);
        withNetwork(Network.SHARED);
    }

    public static String getAddress() {
        return "PLAINTEXT://localhost:" + PORT;
    }
}
