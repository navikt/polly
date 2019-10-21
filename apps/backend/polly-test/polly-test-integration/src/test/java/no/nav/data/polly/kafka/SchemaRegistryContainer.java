package no.nav.data.polly.kafka;

import org.springframework.util.SocketUtils;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.wait.strategy.HttpWaitStrategy;

public class SchemaRegistryContainer extends GenericContainer<SchemaRegistryContainer> {

    private static final int PORT = SocketUtils.findAvailableTcpPort();
    private static final int SCHEMA_REGISTRY_PORT = 8081;

    public SchemaRegistryContainer(String version, KafkaContainer kafka) {
        super("confluentinc/cp-schema-registry:" + version);
        addFixedExposedPort(PORT, SCHEMA_REGISTRY_PORT);
        withNetwork(kafka.getNetwork());
        dependsOn(kafka);
        withEnv("SCHEMA_REGISTRY_HOST_NAME", "schema-registry");
        withEnv("SCHEMA_REGISTRY_LISTENERS", "http://0.0.0.0:8081");
        withEnv("SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS", "PLAINTEXT://" + kafka.getNetworkAliases().get(0) + ":9092");
        waitingFor(new HttpWaitStrategy().forPort(SCHEMA_REGISTRY_PORT));
    }

    public static String getAddress() {
        return "http://localhost:" + PORT;
    }
}