package no.nav.data.catalog.backend.app.kafka.schema.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static java.util.stream.Collectors.joining;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"typeName", "fullTypeName", "fieldType", "wrapperFieldType", "stub", "fields", "enumValues"})
@JsonInclude(Include.NON_EMPTY)
public class AvroType {

    private String typeName;
    @EqualsAndHashCode.Include
    private String fullTypeName;
    private FieldType fieldType;
    // Maps and arrays
    private FieldType wrapperFieldType;
    private Boolean stub;
    private List<AvroField> fields = new ArrayList<>();
    // Does not contain fields as this is a recursive loop avoided type
    private List<String> enumValues = Collections.emptyList();

    public void addField(AvroField field) {
        this.fields.add(field);
    }

    public String toString() {
        return typeName +
                (wrapperFieldType != null ? " " + wrapperFieldType : "") +
                (fieldType == FieldType.UNION ? " " + fieldType : "") +
                (stub == Boolean.TRUE ? " (stubbed)" : "") +
                (enumValues.isEmpty() ? "" : enumValues) +
                (fields.isEmpty() ? "" : "\n" + fields.stream().map(AvroField::toString).collect(joining("\n")));
    }

    public AvroField findField(String fieldName) {
        return findField(fieldName, null);
    }

    public AvroField findField(String fieldName, Integer unionOrdinal) {
        return getFields().stream().filter(f -> f.getName().equals(fieldName) && Objects.equals(f.getUnionOrdinal(), unionOrdinal)).findFirst().orElseThrow();
    }
}
