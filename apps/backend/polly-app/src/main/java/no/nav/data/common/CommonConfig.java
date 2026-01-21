package no.nav.data.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.prometheus.client.CollectorRegistry;
import no.nav.data.common.utils.DateUtil;
import no.nav.data.common.utils.JsonUtils;
import no.nav.data.common.web.TraceHeaderRequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Configuration
@EnableScheduling
public class CommonConfig {

    @Primary
    @Bean
    public ObjectMapper objectMapper() {
        return JsonUtils.getObjectMapper();
    }

    @Bean
    public RestTemplate restTemplate() {
        var rt = new RestTemplate();
        rt.setInterceptors(List.of(TraceHeaderRequestInterceptor.fullInterceptor()));
        return rt;
    }

    @Bean
    @Profile("!test & !local")
    public RestTemplate externalRestTemplate() {
        var rt = new RestTemplate();
        rt.setInterceptors(List.of(TraceHeaderRequestInterceptor.correlationInterceptor()));
        return rt;
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
        return CollectorRegistry.defaultRegistry;
    }

    @Bean
    public ApplicationRunner initStaticConfig(@Value("${polly.default.start-date}") String defaultStartDate) {
        return args -> DateUtil.setDefaultStartDate(defaultStartDate);
    }


}
