package no.nav.data.catalog.backend.app.kafka.schema.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"name"})
@JsonInclude(Include.NON_EMPTY)
public class AvroSchemaField {

    private String name;
    @JsonIgnore
    private int depth;
    private AvroSchemaType type;
    // If union type lists several types for a field, each field with the same name will have a unique ordinal
    private Integer unionOrdinal;

    public String toString() {
        return String.format(" %s%s %s", "-".repeat(depth), name, type);
    }
}
