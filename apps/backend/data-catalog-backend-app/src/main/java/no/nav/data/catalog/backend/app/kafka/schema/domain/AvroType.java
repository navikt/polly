package no.nav.data.catalog.backend.app.kafka.schema.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static java.util.stream.Collectors.joining;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(Include.NON_EMPTY)
public class AvroType {

    private FieldType fieldType;
    private String typeName;
    @EqualsAndHashCode.Include
    private String fullTypeName;
    // Maps and arrays
    private FieldType wrapperFieldType;
    private List<AvroField> fields = new ArrayList<>();
    // Does not contain fields as this is a recursive loop avoided type
    private Boolean stub;
    private boolean nullable;
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
        return getFields().stream().filter(f -> f.getName().equals(fieldName)).findFirst().orElseThrow();
    }

    @JsonIgnore
    public boolean isEnum() {
        return getFieldType() == FieldType.ENUM;
    }

    @JsonIgnore
    public boolean isObject() {
        return getFieldType() == FieldType.OBJECT;
    }

    @JsonIgnore
    public boolean isUnion() {
        return getFieldType() == FieldType.UNION;
    }
}
