package no.nav.data.catalog.backend.app.kafka;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.kafka.dto.GroupsResponse;
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

    public KafkaAdminRestConsumer(KafkaRestProperties kafkaRestProperties, RestTemplate restTemplate) {
        this.baseUrl = kafkaRestProperties.getAdminUrl();
        this.restTemplate = restTemplate;
    }

    public List<String> getAapenTopics() {
        ResponseEntity<List<String>> entity = restTemplate.exchange(baseUrl + "/api/v1/topics", HttpMethod.GET, null, JsonUtils.STRING_LIST);
        if (entity.getStatusCode() != HttpStatus.OK || !entity.hasBody()) {
            log.warn("Fant ingen topics: {}", entity);
            return Collections.emptyList();
        }
        return entity.getBody().stream().filter(topic -> topic.startsWith("aapen-")).collect(Collectors.toList());
    }

    public GroupsResponse getTopicGroups(String topic) {
        ResponseEntity<GroupsResponse> entity = restTemplate.getForEntity(baseUrl + "/api/v1/topics/{topic}/groups", GroupsResponse.class, topic);
        if (entity.getStatusCode() != HttpStatus.OK || !entity.hasBody()) {
            log.warn("Fant ingen topic groups: {}", entity);
            return null;
        }
        return entity.getBody();
    }
}
