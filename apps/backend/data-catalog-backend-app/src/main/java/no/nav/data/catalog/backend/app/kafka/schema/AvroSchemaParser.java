package no.nav.data.catalog.backend.app.kafka.schema;

import no.nav.data.catalog.backend.app.kafka.schema.Domain.AvroSchemaField;
import no.nav.data.catalog.backend.app.kafka.schema.Domain.AvroSchemaType;
import no.nav.data.catalog.backend.app.kafka.schema.Domain.SubjectVersion;
import org.apache.avro.Schema;
import org.apache.avro.Schema.Type;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class AvroSchemaParser {

    public AvroSchemaType parseTopicSchema(SubjectVersion subjectVersion) {
        Schema.Parser parser = new Schema.Parser();
        Schema schema = parser.parse(subjectVersion.getSchema());
        AvroSchemaType avroSchemaType = parseSchema(schema, 0);
        subjectVersion.setTypeData(avroSchemaType);
        return avroSchemaType;
    }

    private AvroSchemaType parseSchema(Schema schema, int depth) {
        var avroSchemaFields = new ArrayList<AvroSchemaField>();
        if (schema.getType() == Type.RECORD) {
            schema.getFields().forEach(f -> avroSchemaFields.add(new AvroSchemaField(f.name(), depth, parseSchema(f.schema(), depth + 1))));
        }
        return new AvroSchemaType(getType(schema), avroSchemaFields);
    }

    private String getType(Schema schema) {
        switch (schema.getType()) {
            case RECORD:
                return schema.getName();
            case UNION:
                return "boolean";
            case ENUM:
                return "enum " + schema.getName() + schema.getEnumSymbols();
            default:
                return schema.getType().getName();
        }
    }
}
