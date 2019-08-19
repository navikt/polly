package no.nav.data.catalog.backend.app.kafka.schema;

import ch.qos.logback.classic.Level;
import lombok.SneakyThrows;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.kafka.KafkaRestProperties;
import no.nav.data.catalog.backend.app.kafka.schema.Domain.SubjectVersion;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.safeStream;

@Component
public class SchemaRegistryConsumer {

    private final String baseUrl;

    private RestTemplate restTemplate;

    public SchemaRegistryConsumer(RestTemplate restTemplate, KafkaRestProperties kafkaRestProperties) {
        this.restTemplate = restTemplate;
        this.baseUrl = kafkaRestProperties.getSchemaRegistryUrl();
    }

    /**
     * Dev only
     */
    public static void main(String[] args) {
        ((ch.qos.logback.classic.Logger) LoggerFactory.getLogger("org.springframework")).setLevel(Level.WARN);
        KafkaRestProperties kafkaRestProperties = new KafkaRestProperties();
        kafkaRestProperties.setSchemaRegistryUrl("http://localhost:8085");
        var schemaRegistryConsumer = new SchemaRegistryConsumer(new RestTemplate(), kafkaRestProperties);
        ArrayList<SubjectVersion> allSubjects = schemaRegistryConsumer.getAllSubjects();
        allSubjects.forEach(new AvroSchemaParser()::parseTopicSchema);
    }

    @SneakyThrows
    ArrayList<SubjectVersion> getAllSubjects() {
        var subjectVersions = new ArrayList<SubjectVersion>();
        List<String> subjects = restTemplate.exchange(String.format("%s/subjects", baseUrl), HttpMethod.GET, null, JsonUtils.STRING_LIST).getBody();

        List<String> includedSubjects = safeStream(subjects)
                .filter(s -> s.startsWith("aapen"))
                .filter(s -> s.endsWith("-value"))
                .collect(Collectors.toList());

        for (String subjectName : includedSubjects) {
            Thread.sleep(500L);
            SubjectVersion subjectVersion = getSubject(subjectName);
            subjectVersions.add(subjectVersion);
        }
        return subjectVersions;
    }

    private SubjectVersion getSubject(String subjectName) {
        List<String> versions = restTemplate.exchange(String.format("%s/subjects/%s/versions", baseUrl, subjectName), HttpMethod.GET, null, JsonUtils.INT_LIST).getBody();
        int version = safeStream(versions).mapToInt(Integer::valueOf).max().orElse(0);

        return restTemplate.getForEntity(String.format("%s/subjects/%s/versions/%d", baseUrl, subjectName, version), SubjectVersion.class).getBody();
    }
}
