package no.nav.data.catalog.backend.app.common.nais;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(("internal/"))
public class NaisEndpoints {

	@GetMapping(path = "isReady")
	public ResponseEntity<Void> isReady() {
		return ResponseEntity.ok().build();
	}

	@GetMapping(path = "isAlive")
	public ResponseEntity<Void> isAlive() {
		return ResponseEntity.ok().build();
	}
}
