package no.nav.data.catalog.backend.app.kafka.schema.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"name"})
public class AvroSchemaField {

    private String name;
    @JsonIgnore
    private int depth;
    private AvroSchemaType type;

    public String toString() {
        return String.format(" %s%s %s", "-".repeat(depth), name, type);
    }
}
