package no.nav.data.catalog.backend.app.common.nais;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/backend/internal/", produces = MediaType.APPLICATION_JSON_VALUE)
public class NaisEndpoints {

	@GetMapping("/isAlive")
	ResponseEntity alive() {
		return ResponseEntity.ok("Up and running!");
	}

	@GetMapping("/isReady")
	ResponseEntity ready() {
		return ResponseEntity.ok("Ready to receive!");
	}
}
