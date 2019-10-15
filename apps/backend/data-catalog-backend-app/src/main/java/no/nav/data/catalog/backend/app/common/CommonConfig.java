package no.nav.data.catalog.backend.app.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.hotspot.DefaultExports;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.common.web.TraceHeaderRequestInterceptor;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchProperties;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.Proxy.Type;

@Slf4j
@Configuration
public class CommonConfig {

    @Primary
    @Bean
    public ObjectMapper objectMapper() {
        return JsonUtils.getObjectMapper();
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .additionalInterceptors(new TraceHeaderRequestInterceptor())
                .build();
    }

    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
        jsonConverter.setObjectMapper(objectMapper());
        return jsonConverter;
    }

    @Bean
    public RestHighLevelClient restHighLevelClient(ElasticsearchProperties properties) {
        log.info("Elasticsearch {} {}:{}", properties.getSchema(), properties.getHost(), properties.getPort());

        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY, new UsernamePasswordCredentials(properties.getUser(), properties.getPassword()));

        return new RestHighLevelClient(
                RestClient.builder(
                        new HttpHost(properties.getHost(), properties.getPort(), properties.getSchema())
                ).setHttpClientConfigCallback(httpClientBuilder -> httpClientBuilder.setDefaultCredentialsProvider(credentialsProvider))
        );
    }

    @Bean
    public Proxy proxy(NavProperties navProperties) {
        return new Proxy(Type.HTTP, new InetSocketAddress(navProperties.getProxyHost(), navProperties.getProxyPort()));
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
