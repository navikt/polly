package no.nav.data.catalog.backend.app.kafka.schema;

import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroField;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchema;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaVersion;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroType;
import no.nav.data.catalog.backend.app.kafka.schema.domain.FieldType;
import org.apache.avro.Schema;
import org.apache.avro.Schema.Type;

import java.util.Deque;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

public class AvroSchemaParser {

    private AvroSchemaParser() {
    }

    private Schema.Parser parser = new Schema.Parser();
    private Deque<String> stack = new LinkedList<>();
    private Set<AvroType> allTypes = new HashSet<>();

    public static AvroSchema parseSchema(AvroSchemaVersion avroSchemaVersion) {
        return new AvroSchemaParser().parse(avroSchemaVersion);
    }

    private AvroSchema parse(AvroSchemaVersion avroSchemaVersion) {
        String schemaString = avroSchemaVersion.getSchema();
        String subject = avroSchemaVersion.getSubject();

        Schema schema = parser.parse(schemaString);
        AvroType avroType = parseSchema(schema, 0);
        String topicName = subject.substring(0, subject.length() - "-value".length());
        return new AvroSchema(topicName, avroType, allTypes);
    }

    private AvroType parseSchema(Schema schemaIn, int depth) {
        AvroType avroType = new AvroType();
        Schema schema = unwrapSchema(schemaIn, avroType);

        avroType.setTypeName(getTypeName(schema));
        avroType.setFieldType(getType(schema));
        avroType.setFullTypeName(schema.getFullName().equals(avroType.getTypeName()) ? null : schema.getFullName());

        if (avroType.isEnum()) {
            avroType.setEnumValues(schema.getEnumSymbols());
        }

        // Avoid loops
        if (avroType.getFieldType() == FieldType.OBJECT && stack.contains(avroType.getFullTypeName())) {
            avroType.setStub(Boolean.TRUE);
            return avroType;
        }
        stack.addLast(avroType.getFullTypeName());

        if (avroType.isObject()) {
            schema.getFields().forEach(f -> avroType.addField(new AvroField(f.name(), depth, parseSchema(f.schema(), depth + 1), null)));
        } else if (avroType.isUnion()) {
            AtomicInteger i = new AtomicInteger(1);
            schema.getTypes()
                    .stream().filter(type -> type.getType() != Type.NULL)
                    .forEach(unionType -> avroType.addField(new AvroField(getTypeName(unionType), depth, parseSchema(unionType, depth + 1), i.getAndIncrement())));
        }
        if (avroType.isObject() || avroType.isEnum()) {
            allTypes.add(avroType);
        }
        stack.removeLast();
        return avroType;
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
                return isNullableOrdinaryField(schema) ? getType(getNullableUnionType(schema)) : FieldType.UNION;
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
                return isNullableOrdinaryField(schema) ? getTypeName(getNullableUnionType(schema)) : unionTypeString(schema);
            default:
                return schema.getType().getName() + (schema.getLogicalType() != null ? " " + schema.getLogicalType().getName() : "");
        }
    }

    private String unionTypeString(Schema schema) {
        return schema.getTypes()
                .stream().filter(type -> type.getType() != Type.NULL)
                .map(this::getTypeName).collect(Collectors.joining(", ", "[", "]"));
    }

    private Schema getNullableUnionType(Schema schema) {
        return schema.getTypes().stream().filter(typeSchema -> typeSchema.getType() != Type.NULL).findFirst().orElseThrow();
    }

    private boolean isNullableField(Schema schema) {
        return schema.getType() == Type.UNION && schema.getTypes().stream().anyMatch(typeSchema -> typeSchema.getType() == Type.NULL);
    }

    private boolean isNullableOrdinaryField(Schema schema) {
        return schema.getType() == Type.UNION && schema.getTypes().stream().filter(typeSchema -> typeSchema.getType() != Type.NULL).count() == 1;
    }

    private Schema unwrapSchema(Schema schema, AvroType avroType) {
        // Unwrap nullable unions and treat as normal field
        avroType.setNullable(isNullableField(schema));
        Schema nonNullSchema = isNullableOrdinaryField(schema) ? getNullableUnionType(schema) : schema;

        FieldType outerType = getType(nonNullSchema);

        // Unwrap arrays and maps
        if (outerType == FieldType.ARRAY) {
            avroType.setWrapperFieldType(outerType);
            return nonNullSchema.getElementType();
        } else if (outerType == FieldType.MAP) {
            avroType.setWrapperFieldType(outerType);
            return nonNullSchema.getValueType();
        } else {
            // No wrapper, return original
            return nonNullSchema;
        }
    }
}
