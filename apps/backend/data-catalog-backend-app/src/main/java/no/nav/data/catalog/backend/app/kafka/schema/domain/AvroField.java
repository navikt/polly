package no.nav.data.catalog.backend.app.kafka.schema.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"name", "nullable", "unionOrdinal", "type"})
@JsonInclude(Include.NON_EMPTY)
public class AvroField {

    private String name;
    @JsonIgnore
    private int depth;
    private boolean nullable;
    // If union type lists several types for a field, each field with the same name will have a unique ordinal
    private Integer unionOrdinal;
    private AvroType type;

    public String toString() {
        return String.format(" %s%s %s%s", "-".repeat(depth), name, type, unionOrdinalString());
    }

    private String unionOrdinalString() {
        return isUnion() ? String.format(" UNION-%02d", unionOrdinal) : "";
    }

    private boolean isUnion() {
        return unionOrdinal != null;
    }
}
