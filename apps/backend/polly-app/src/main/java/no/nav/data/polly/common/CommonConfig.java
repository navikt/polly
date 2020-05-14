package no.nav.data.polly.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.hotspot.DefaultExports;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.common.web.TraceHeaderRequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Configuration
@EnableScheduling
public class CommonConfig {

    @Primary
    @Bean
    public ObjectMapper objectMapper() {
        return JsonUtils.getObjectMapper();
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .additionalInterceptors(TraceHeaderRequestInterceptor.fullInterceptor())
                .build();
    }

    @Bean
    @Profile("!test & !local")
    public RestTemplate externalRestTemplate(RestTemplateBuilder builder) {
        return builder
                .additionalInterceptors(TraceHeaderRequestInterceptor.correlationInterceptor())
                .build();
    }

    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
        jsonConverter.setObjectMapper(objectMapper());
        return jsonConverter;
    }

    /**
     * Make sure spring uses the defaultRegistry
     */
    @Bean
    public CollectorRegistry collectorRegistry() {
        DefaultExports.initialize();
        return CollectorRegistry.defaultRegistry;
    }

    @Bean
    public ApplicationRunner initStaticConfig(@Value("${polly.default.start-date}") String defaultStartDate) {
        return args -> DateUtil.setDefaultStartDate(defaultStartDate);
    }


}
