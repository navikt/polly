package no.nav.data.catalog.backend.app;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.SocketUtils;

@Slf4j
public final class TestPorts {

    private TestPorts() {
    }

    public static final int WIREMOCK_PORT = SocketUtils.findAvailableTcpPort();
    public static final int ELASTICSEARCH_PORT = SocketUtils.findAvailableTcpPort();

    static {
        log.info("Wiremock port {}", WIREMOCK_PORT);
        log.info("Elasticsearch port {}", ELASTICSEARCH_PORT);
        System.setProperty("wiremock.server.port", String.valueOf(WIREMOCK_PORT));
        System.setProperty("elasticsearch.port", String.valueOf(ELASTICSEARCH_PORT));
    }
}
