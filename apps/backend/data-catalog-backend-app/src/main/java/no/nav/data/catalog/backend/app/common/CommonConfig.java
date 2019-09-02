package no.nav.data.catalog.backend.app.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.hotspot.DefaultExports;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.auditing.AuditorAwareImpl;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class CommonConfig {
	@Value("${elasticsearch.host}")
	private String elasticsearchHost;

	@Value("${elasticsearch.port}")
	private int elasticsearchPort;

	@Primary
	@Bean
	public ObjectMapper objectMapper() {
		return JsonUtils.getObjectMapper();
	}

	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}

	@Bean
	public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
		MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
		jsonConverter.setObjectMapper(objectMapper());
		return jsonConverter;
	}

	@Bean
	public RestHighLevelClient restHighLevelClient() {
		log.info("Elasticsearch {}:{}", elasticsearchHost, elasticsearchPort);
		return new RestHighLevelClient(
				RestClient.builder(
						new HttpHost(elasticsearchHost, elasticsearchPort, "http")));
	}

	@Bean
	public AuditorAware<String> auditorAware() {
		return new AuditorAwareImpl();
	}

	/**
	 * Make sure spring uses the defaultRegistry
	 */
	@Bean
	public CollectorRegistry collectorRegistry() {
		DefaultExports.initialize();
		return CollectorRegistry.defaultRegistry;
	}
}
