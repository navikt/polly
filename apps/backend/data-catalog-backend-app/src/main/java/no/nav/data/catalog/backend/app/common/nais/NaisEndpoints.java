package no.nav.data.catalog.backend.app.common.nais;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@RestController
@RequestMapping(("/internal/"))
public class NaisEndpoints {

    private static AtomicInteger isReady = new AtomicInteger(1);
    private final HealthIndicator dbHealthIndicator;

    @Autowired
    public NaisEndpoints(MeterRegistry meterRegistry, HealthIndicator dbHealthIndicator) {
        this.dbHealthIndicator = dbHealthIndicator;
        Gauge.builder("dok_app_is_ready", isReady, AtomicInteger::get).register(meterRegistry);
    }

    @GetMapping("isAlive")
    public ResponseEntity<String> isAlive() {
        if (dbHealthIndicator.health().getStatus() != Status.UP) {
            log.warn("isAlive error {}", dbHealthIndicator.health());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @ResponseBody
    @RequestMapping(value = "isReady")
    public ResponseEntity<String> isReady() {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
