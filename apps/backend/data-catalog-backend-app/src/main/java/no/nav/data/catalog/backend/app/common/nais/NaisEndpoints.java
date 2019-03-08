package no.nav.data.catalog.backend.app.common.nais;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping(("internal/"))
public class NaisEndpoints {
	public static final String APPLICATION_ALIVE = "Application is alive!";
	public static final String APPLICATION_READY = "Application is ready for traffic!";
	private static AtomicInteger isReady = new AtomicInteger(1);

	@Inject
	public NaisEndpoints(MeterRegistry meterRegistry) {
		Gauge.builder("dok_app_is_ready", isReady, AtomicInteger::get).register(meterRegistry);
	}

	@GetMapping("isAlive")
	public String isAlive() {
		return APPLICATION_ALIVE;
	}

	@ResponseBody
	@RequestMapping(value = "isReady", produces = MediaType.TEXT_HTML_VALUE)
	public ResponseEntity<String> isReady() {
		return new ResponseEntity<>(APPLICATION_READY, HttpStatus.OK);
	}
}
