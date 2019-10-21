package no.nav.polly.common.nais;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.extern.slf4j.Slf4j;
import no.nav.polly.codelist.CodelistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@RestController
@RequestMapping(("/internal/"))
public class NaisEndpoints {

    private static AtomicInteger isReady = new AtomicInteger(1);
    private final CodelistRepository codelistRepository;

    @Autowired
    public NaisEndpoints(MeterRegistry meterRegistry, CodelistRepository codelistRepository) {
        this.codelistRepository = codelistRepository;
        Gauge.builder("dok_app_is_ready", isReady, AtomicInteger::get).register(meterRegistry);
    }

    @GetMapping("isAlive")
    public ResponseEntity<String> isAlive() {
        try {
            codelistRepository.count();
        } catch (Exception e) {
            log.warn("isAlive error {}", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "isReady")
    public ResponseEntity<String> isReady() {
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
