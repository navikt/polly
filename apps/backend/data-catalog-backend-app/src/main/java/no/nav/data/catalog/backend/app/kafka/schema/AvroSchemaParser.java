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
        FieldType type = getType(schema);

        avroType.setTypeName(getTypeName(schema));
        avroType.setFieldType(type);
        avroType.setFullTypeName(schema.getFullName().equals(avroType.getTypeName()) ? null : schema.getFullName());

        if (type.isObject()) {
            // Avoid loops
            if (stack.contains(avroType.getFullTypeName())) {
                avroType.setStub(Boolean.TRUE);
                return avroType;
            }
            stack.addLast(avroType.getFullTypeName());

            schema.getFields().forEach(field -> {
                if (!getType(field.schema()).isUnion()) {
                    avroType.addField(createField(field.name(), depth, field.schema()));
                } else {
                    AtomicInteger unionOrdinal = new AtomicInteger(1);
                    field.schema().getTypes().forEach(unionType -> avroType.addField(createUnionField(field.name(), depth, unionType, unionOrdinal.getAndIncrement())));
                }
            });

            stack.removeLast();
            allTypes.add(avroType);
        } else if (type.isEnum()) {
            avroType.setEnumValues(schema.getEnumSymbols());
            allTypes.add(avroType);
        }

        return avroType;
    }

    private AvroField createField(String name, int depth, Schema schema) {
        return AvroField.builder().name(name).depth(depth).nullable(isNullableField(schema)).type(parseSchema(schema, depth + 1)).build();
    }

    private AvroField createUnionField(String name, int depth, Schema schema, Integer unionOrdinal) {
        return AvroField.builder().name(name).depth(depth).nullable(isNullableField(schema)).type(parseSchema(schema, depth)).unionOrdinal(unionOrdinal).build();
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
            default:
                return schema.getType().getName() + (schema.getLogicalType() != null ? " " + schema.getLogicalType().getName() : "");
        }
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
