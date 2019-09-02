package no.nav.data.catalog.backend.app.elasticsearch;

import org.springframework.util.SocketUtils;
import org.testcontainers.containers.FixedHostPortGenericContainer;
import org.testcontainers.containers.wait.strategy.HttpWaitStrategy;
import org.testcontainers.utility.Base58;

import java.time.Duration;

public class FixedElasticsearchContainer extends FixedHostPortGenericContainer<FixedElasticsearchContainer> {
    private static final int ELASTICSEARCH_PORT = SocketUtils.findAvailableTcpPort();
    private static final int ELASTICSEARCH_DEFAULT_PORT = 9200;

    static {
        System.setProperty("elasticsearch.port", String.valueOf(ELASTICSEARCH_PORT));
    }

    public FixedElasticsearchContainer(String dockerImageName) {
        super(dockerImageName);
        this.logger().info("Starting an elasticsearch container using [{}]", dockerImageName);
        this.withNetworkAliases("elasticsearch-" + Base58.randomString(6));
        this.withEnv("discovery.type", "single-node");
        this.addFixedExposedPort(ELASTICSEARCH_PORT, ELASTICSEARCH_DEFAULT_PORT);
        this.setWaitStrategy((new HttpWaitStrategy()).forPort(ELASTICSEARCH_DEFAULT_PORT).forStatusCodeMatching((response) -> response == 200 || response == 401).withStartupTimeout(Duration.ofMinutes(2L)));
    }

}
