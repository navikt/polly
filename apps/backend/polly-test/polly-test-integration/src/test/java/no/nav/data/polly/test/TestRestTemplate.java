package no.nav.data.polly.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Drop-in replacement for org.springframework.boot.test.web.client.TestRestTemplate,
 * which was removed in Spring Boot 4.
 * Wraps a RestTemplate with a fixed base URL so relative paths can be used in tests.
 * Does NOT throw on 4xx/5xx - returns the ResponseEntity with the error status.
 */
@SuppressWarnings("deprecation")
public class TestRestTemplate {

    private final RestTemplate restTemplate;

    public TestRestTemplate(String baseUrl, ObjectMapper objectMapper) {
        // Build RestTemplate with StringHttpMessageConverter first (handles String.class),
        // then app's ObjectMapper Jackson converter (handles RestResponsePage<T> subclasses),
        // then the rest of the defaults (ByteArray, Resource, Form, etc.)
        var stringConverter = new StringHttpMessageConverter(java.nio.charset.StandardCharsets.UTF_8);
        var jacksonConverter = new MappingJackson2HttpMessageConverter(objectMapper);
        List<HttpMessageConverter<?>> converters = new ArrayList<>();
        converters.add(stringConverter);
        converters.add(jacksonConverter);
        // Add remaining default converters (skip String and Jackson)
        var defaults = new RestTemplate();
        for (HttpMessageConverter<?> c : defaults.getMessageConverters()) {
            if (!(c instanceof MappingJackson2HttpMessageConverter) && !(c instanceof StringHttpMessageConverter)) {
                converters.add(c);
            }
        }
        this.restTemplate = new RestTemplate(converters);
        this.restTemplate.setUriTemplateHandler(new DefaultUriBuilderFactory(baseUrl));
        // Do not throw on 4xx/5xx - return the response so tests can assert on status codes
        this.restTemplate.setErrorHandler(new DefaultResponseErrorHandler() {
            @Override
            public boolean hasError(ClientHttpResponse response) { return false; }
        });
    }

    public TestRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public RestTemplate getRestTemplate() {
        return restTemplate;
    }

    public <T> ResponseEntity<T> getForEntity(String url, Class<T> responseType, Object... urlVariables) {
        return restTemplate.getForEntity(url, responseType, urlVariables);
    }

    public <T> T getForObject(String url, Class<T> responseType, Object... urlVariables) {
        return restTemplate.getForObject(url, responseType, urlVariables);
    }

    public <T> ResponseEntity<T> postForEntity(String url, Object request, Class<T> responseType, Object... urlVariables) {
        return restTemplate.postForEntity(url, request, responseType, urlVariables);
    }

    public <T> T postForObject(String url, Object request, Class<T> responseType, Object... urlVariables) {
        return restTemplate.postForObject(url, request, responseType, urlVariables);
    }

    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, HttpEntity<?> requestEntity,
            Class<T> responseType, Object... urlVariables) {
        return restTemplate.exchange(url, method, requestEntity, responseType, urlVariables);
    }

    public <T> ResponseEntity<T> exchange(String url, HttpMethod method, HttpEntity<?> requestEntity,
            ParameterizedTypeReference<T> responseType, Object... urlVariables) {
        return restTemplate.exchange(url, method, requestEntity, responseType, urlVariables);
    }

    public void delete(String url, Object... urlVariables) {
        restTemplate.delete(url, urlVariables);
    }

    public <T> ResponseEntity<T> putForEntity(String url, Object request, Class<T> responseType, Object... urlVariables) {
        return restTemplate.exchange(url, HttpMethod.PUT, new HttpEntity<>(request), responseType, urlVariables);
    }
}
















