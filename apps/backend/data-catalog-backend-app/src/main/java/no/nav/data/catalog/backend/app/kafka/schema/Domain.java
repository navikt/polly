package no.nav.data.catalog.backend.app.kafka.schema;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import static java.util.stream.Collectors.joining;

public class Domain {

    private Domain() {
    }

    @Data
    public static class SubjectVersion {

        private Integer id;
        private String schema;
        private String subject;
        private Integer version;

        private AvroSchemaType typeData;

        public String toString() {
            return "topic: " + getTopic() + " version: " + getVersion() + " " + typeData;
        }

        public String getTopic() {
            return getSubject().substring(0, getSubject().length() - "-value".length());
        }

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AvroSchemaType {

        private String type;
        private List<AvroSchemaField> fields;

        public String toString() {
            return type + (fields.isEmpty() ? "" : "\n" + fields.stream().map(AvroSchemaField::toString).collect(joining("\n")));
        }

        AvroSchemaField findField(String fieldName) {
            return getFields().stream().filter(f -> f.getName().equals(fieldName)).findFirst().orElseThrow();
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AvroSchemaField {

        private String name;
        private int depth;
        private AvroSchemaType avroSchemaType;

        public String toString() {
            return String.format(" %s%s %s", "-".repeat(depth), name, avroSchemaType);
        }
    }
}
