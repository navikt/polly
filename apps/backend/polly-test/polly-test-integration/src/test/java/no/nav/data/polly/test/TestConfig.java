package no.nav.data.polly.test;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;

import java.nio.charset.Charset;
import java.util.Optional;

@Slf4j
@Configuration
public class TestConfig {

    @Bean
    public ApplicationRunner testRestTemplate(TestRestTemplate testRestTemplate) {
        return (args) -> {
            testRestTemplate.getRestTemplate().setRequestFactory(new BufferingClientHttpRequestFactory(testRestTemplate.getRestTemplate().getRequestFactory()));
            testRestTemplate.getRestTemplate().setErrorHandler(new DefaultResponseErrorHandler() {
                @Override
                public void handleError(ClientHttpResponse response, HttpStatus statusCode) {
                    log.error(new String(getResponseBody(response), Optional.ofNullable(getCharset(response)).orElse(Charset.defaultCharset())));
                }
            });
        };
    }
}
