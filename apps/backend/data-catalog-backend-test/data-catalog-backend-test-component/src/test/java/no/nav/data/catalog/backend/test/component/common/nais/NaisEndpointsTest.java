package no.nav.data.catalog.backend.test.component.common.nais;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.when;

import no.nav.data.catalog.backend.test.component.ComponentTestConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
public class NaisEndpointsTest {

	@MockBean
	private TestRestTemplate testRestTemplate;

	@Test
	public void naisIsReady() {
		String urlIsReady = "/backend/internal/isReady";
		when(testRestTemplate.exchange(urlIsReady, HttpMethod.GET, HttpEntity.EMPTY, String.class)).thenReturn(ResponseEntity.ok("Up and running!"));

		ResponseEntity<String> responseEntity = testRestTemplate.exchange(
				urlIsReady,
				HttpMethod.GET,
				HttpEntity.EMPTY,
				String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody(), is("Up and running!"));
	}

	@Test
	public void naisIsAlive() {
		String urlIsAlive = "/backend/internal/isAlive";
		when(testRestTemplate.exchange(urlIsAlive, HttpMethod.GET, HttpEntity.EMPTY, String.class)).thenReturn(ResponseEntity.ok("Ready to receive!"));

		ResponseEntity<String> responseEntity = testRestTemplate.exchange(
				urlIsAlive,
				HttpMethod.GET,
				HttpEntity.EMPTY,
				String.class);
		assertThat(responseEntity.getStatusCode(), is(HttpStatus.OK));
		assertThat(responseEntity.getBody(), is("Ready to receive!"));
	}
}