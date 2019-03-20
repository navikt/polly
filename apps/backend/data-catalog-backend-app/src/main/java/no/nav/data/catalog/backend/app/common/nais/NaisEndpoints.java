package no.nav.data.catalog.backend.app.common.nais;

import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping(("/backend/internal/"))
public class NaisEndpoints {
	private static AtomicInteger isReady = new AtomicInteger(1);

	@Autowired
	public NaisEndpoints(MeterRegistry meterRegistry) {
		Gauge.builder("dok_app_is_ready", isReady, AtomicInteger::get).register(meterRegistry);
	}

	@GetMapping("isAlive")
	public ResponseEntity<String> isAlive() {
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@ResponseBody
	@RequestMapping(value = "isReady")
	public ResponseEntity<String> isReady() {
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
