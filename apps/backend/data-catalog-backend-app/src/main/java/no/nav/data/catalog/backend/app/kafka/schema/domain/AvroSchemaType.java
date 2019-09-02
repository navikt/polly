package no.nav.data.catalog.backend.app.kafka.schema.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

import static java.util.stream.Collectors.joining;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(Include.NON_EMPTY)
public class AvroSchemaType {

    private FieldType fieldType;
    private String typeName;
    @EqualsAndHashCode.Include
    private String fullTypeName;
    // Maps and arrays
    private FieldType wrapperFieldType;
    private List<AvroSchemaField> fields;
    // Does not contain fields as this is a recursive loop avoided type
    private Boolean stub;
    private List<String> enumValues = Collections.emptyList();

    public AvroSchemaType(FieldType fieldType, String typeName, FieldType wrapperFieldType, String fullTypeName, List<AvroSchemaField> fields) {
        this.fieldType = fieldType;
        this.typeName = typeName;
        this.fullTypeName = fullTypeName;
        this.wrapperFieldType = wrapperFieldType;
        this.fields = fields;
    }

    public String toString() {
        return typeName +
                (wrapperFieldType != null ? " " + wrapperFieldType : "") +
                (fieldType == FieldType.UNION ? " " + fieldType : "") +
                (stub == Boolean.TRUE ? " (stubbed)" : "") +
                (enumValues.isEmpty() ? "" : enumValues) +
                (fields.isEmpty() ? "" : "\n" + fields.stream().map(AvroSchemaField::toString).collect(joining("\n")));
    }

    public AvroSchemaField findField(String fieldName) {
        return getFields().stream().filter(f -> f.getName().equals(fieldName)).findFirst().orElseThrow();
    }
}
