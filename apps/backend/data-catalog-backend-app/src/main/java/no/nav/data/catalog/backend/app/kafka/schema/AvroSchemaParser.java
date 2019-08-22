package no.nav.data.catalog.backend.app.kafka.schema;

import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchema;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaField;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaType;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaVersion;
import no.nav.data.catalog.backend.app.kafka.schema.domain.FieldType;
import org.apache.avro.Schema;
import org.apache.avro.Schema.Type;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Deque;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AvroSchemaParser {

    private AvroSchemaParser() {
    }

    private Schema.Parser parser = new Schema.Parser();
    private Deque<String> stack = new LinkedList<>();
    private Set<AvroSchemaType> allTypes = new HashSet<>();

    public static AvroSchema parseSchema(AvroSchemaVersion avroSchemaVersion) {
        return new AvroSchemaParser().parse(avroSchemaVersion);
    }

    private AvroSchema parse(AvroSchemaVersion avroSchemaVersion) {
        String schemaString = avroSchemaVersion.getSchema();
        String subject = avroSchemaVersion.getSubject();

        Schema schema = parser.parse(schemaString);
        AvroSchemaType avroSchemaType = parseSchema(schema, 0);
        String topicName = subject.substring(0, subject.length() - "-value".length());
        return new AvroSchema(topicName, avroSchemaType, allTypes);
    }

    private AvroSchemaType parseSchema(Schema schemaIn, int depth) {
        var avroSchemaFields = new ArrayList<AvroSchemaField>();

        // Ignore nullable unions
        var nonNullschema = isNullableField(schemaIn) ? getNullableUnionType(schemaIn) : schemaIn;

        // Unwrap arrays and maps
        Schema schema;
        if (nonNullschema.getType() == Type.ARRAY) {
            schema = nonNullschema.getElementType();
        } else if (nonNullschema.getType() == Type.MAP) {
            schema = nonNullschema.getValueType();
        } else {
            schema = nonNullschema;
        }
        String schemaName = schema.getFullName();

        AvroSchemaType avroSchemaType = new AvroSchemaType(getType(schema), getTypeName(schema), getType(nonNullschema), schemaName, avroSchemaFields);
        if (avroSchemaType.getFieldType() == FieldType.ENUM) {
            avroSchemaType.setEnumValues(schema.getEnumSymbols());
        }

        // Avoid loops
        if (stack.contains(schemaName)) {
            avroSchemaType.setStub(true);
            return avroSchemaType;
        }
        stack.add(schemaName);

        if (schema.getType() == Type.RECORD) {
            schema.getFields().forEach(f -> avroSchemaFields.add(new AvroSchemaField(f.name(), depth, parseSchema(f.schema(), depth + 1))));
        } else if (schema.getType() == Type.UNION) {
            schema.getTypes().forEach(type -> avroSchemaFields.add(new AvroSchemaField(getTypeName(schema), depth, parseSchema(type, depth + 1))));
        }
        if (avroSchemaType.getFieldType() == FieldType.OBJECT || avroSchemaType.getFieldType() == FieldType.ENUM) {
            allTypes.add(avroSchemaType);
        }
        stack.removeLast();
        return avroSchemaType;
    }

    private FieldType getType(Schema schema) {
        switch (schema.getType()) {
            case RECORD:
                return FieldType.OBJECT;
            case ENUM:
                return FieldType.ENUM;
            case ARRAY:
                return FieldType.ARRAY;
            case MAP:
                return FieldType.MAP;
            case UNION:
                return isNullableField(schema) ? getType(getNullableUnionType(schema)) : FieldType.UNION;
            default:
                return FieldType.BASIC;
        }
    }

    private String getTypeName(Schema schema) {
        switch (schema.getType()) {
            case ENUM:
            case RECORD:
                return schema.getName();
            case UNION:
                return isNullableField(schema) ? getTypeName(getNullableUnionType(schema))
                        : schema.getTypes().stream().map(this::getTypeName).collect(Collectors.joining(", ", "[", "]"));
            default:
                return schema.getType().getName() + (schema.getLogicalType() != null ? " " + schema.getLogicalType().getName() : "");
        }
    }

    private Schema getNullableUnionType(Schema schema) {
        return schema.getTypes().stream().filter(typeSchema -> typeSchema.getType() != Type.NULL).findFirst().orElseThrow();
    }

    private boolean isNullableField(Schema schema) {
        return schema.getType() == Type.UNION && schema.getTypes().stream().filter(typeSchema -> typeSchema.getType() != Type.NULL).count() == 1;
    }
}
