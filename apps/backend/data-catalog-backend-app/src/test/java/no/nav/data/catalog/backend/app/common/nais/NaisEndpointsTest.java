package no.nav.data.catalog.backend.app.common.nais;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

import io.micrometer.core.instrument.composite.CompositeMeterRegistry;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RunWith(MockitoJUnitRunner.class)
public class NaisEndpointsTest {

	private NaisEndpoints naisEndpoints = new NaisEndpoints(new CompositeMeterRegistry());

	@Test
	public void naisIsReady() {
		ResponseEntity response = naisEndpoints.isReady();
		assertThat(response.getStatusCode(), is(HttpStatus.OK));
	}

	@Test
	public void naisIsAlive() {
		ResponseEntity response = naisEndpoints.isAlive();
		assertThat(response.getStatusCode(), is(HttpStatus.OK));
	}
}
