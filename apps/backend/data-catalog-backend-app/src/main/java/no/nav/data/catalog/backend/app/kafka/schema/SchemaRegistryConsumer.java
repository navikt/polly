package no.nav.data.catalog.backend.app.kafka.schema;

import ch.qos.logback.classic.Level;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.kafka.KafkaRestProperties;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchema;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaVersion;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.catalog.backend.app.common.utils.StreamUtils.safeStream;

@Component
public class SchemaRegistryConsumer {

    private final String baseUrl;
    private final RestTemplate restTemplate;

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
//        AvroSchemaVersion subjectForTopic = schemaRegistryConsumer.getAvroSchemaVersionForTopic("aapen-registre-medlemskapEndret-v1-t1");
//        AvroSchema avroSchema = AvroSchemaParser.parseSchema(subjectForTopic);
        List<AvroSchemaVersion> allSubjects = schemaRegistryConsumer.getAllSubjects();
        for (AvroSchemaVersion allSubject : allSubjects) {
            System.out.println(allSubject.getSchema() + "\n");
            AvroSchema x = AvroSchemaParser.parseSchema(allSubject);
            System.out.println(x + "\n\n");
        }
    }

    public List<AvroSchemaVersion> getAllSubjects() {
        var subjectVersions = new ArrayList<AvroSchemaVersion>();

        List<String> includedSubjects = listSubjects().stream()
//                .filter(s -> s.startsWith("aapen"))
                .filter(s -> s.endsWith("-value"))
                .collect(Collectors.toList());

        for (String subjectName : includedSubjects) {
            AvroSchemaVersion avroSchemaVersion = getSubject(subjectName);
            subjectVersions.add(avroSchemaVersion);
        }
        return subjectVersions;
    }

    public AvroSchemaVersion getAvroSchemaVersionForTopic(String topicName) {
        String subjectName = topicName + "-value";
        List<String> subjects = listSubjects();
        if (subjects.contains(subjectName)) {
            return getSubject(subjectName);
        }
        return null;
    }

    private List<String> listSubjects() {
        List<String> list = restTemplate.exchange(String.format("%s/subjects", baseUrl), HttpMethod.GET, null, JsonUtils.STRING_LIST).getBody();
        return nullToEmptyList(list);
    }

    private AvroSchemaVersion getSubject(String subjectName) {
        List<String> versions = restTemplate.exchange(String.format("%s/subjects/%s/versions", baseUrl, subjectName), HttpMethod.GET, null, JsonUtils.INT_LIST).getBody();
        int version = safeStream(versions).mapToInt(Integer::valueOf).max().orElse(0);

        return restTemplate.getForEntity(String.format("%s/subjects/%s/versions/%d", baseUrl, subjectName, version), AvroSchemaVersion.class).getBody();
    }
}
