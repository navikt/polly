package no.nav.polly.kafka;

import lombok.extern.slf4j.Slf4j;
import no.nav.polly.kafka.dto.GroupsResponse;
import no.nav.polly.kafka.dto.TopicsResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class KafkaAdminRestConsumer {

    private final String baseUrl;
    private final RestTemplate restTemplate;
    private final HttpHeaders apiKeyHeaders;

    public KafkaAdminRestConsumer(KafkaRestProperties kafkaRestProperties, RestTemplate restTemplate) {
        this.baseUrl = kafkaRestProperties.getAdminUrl();
        this.restTemplate = restTemplate;
        this.apiKeyHeaders = new HttpHeaders();
        this.apiKeyHeaders.set("x-nav-apiKey", kafkaRestProperties.getAdminApikey());
    }

    public List<String> getAapenTopics() {
        return getAllTopics().stream().filter(topic -> topic.startsWith("aapen-")).collect(Collectors.toList());
    }

    public List<String> getAllTopics() {
        ResponseEntity<TopicsResponse> entity = restTemplate.exchange(baseUrl + "/api/v1/topics", HttpMethod.GET, new HttpEntity<>(apiKeyHeaders), TopicsResponse.class);
        if (entity.getStatusCode() != HttpStatus.OK || !entity.hasBody()) {
            log.warn("Fant ingen topics: {}", entity);
            return Collections.emptyList();
        }
        return entity.getBody().getTopics();
    }

    public GroupsResponse getTopicGroups(String topic) {
        ResponseEntity<GroupsResponse> entity = restTemplate
                .exchange(baseUrl + "/api/v1/topics/{topic}/groups", HttpMethod.GET, new HttpEntity<>(apiKeyHeaders), GroupsResponse.class, topic);
        if (entity.getStatusCode() != HttpStatus.OK || !entity.hasBody()) {
            log.warn("Fant ingen topic groups: {}", entity);
            return null;
        }
        return entity.getBody();
    }
}
