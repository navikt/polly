package no.nav.polly.kafka.schema;

import no.nav.polly.common.utils.JsonUtils;
import no.nav.polly.kafka.schema.domain.AvroField;
import no.nav.polly.kafka.schema.domain.AvroSchema;
import no.nav.polly.kafka.schema.domain.AvroSchemaVersion;
import no.nav.polly.kafka.schema.domain.AvroType;
import no.nav.polly.kafka.schema.domain.FieldType;
import org.junit.jupiter.api.Test;

import java.util.Collections;

import static no.nav.polly.TestUtil.readFile;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AvroSchemaParserTest {

    @Test
    void testEnum() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroField enumField = rootType.findField("toDoItems").getType().findField("status");
        assertThat(enumField.getType().getFieldType()).isEqualTo(FieldType.ENUM);
        assertThat(enumField.getType().getTypeName()).isEqualTo("ToDoStatus");
        assertThat(enumField.getType().getEnumValues()).contains("HIDDEN", "ACTIONABLE", "DONE", "ARCHIVED", "DELETED");
    }

    @Test
    void testMap() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/type_with_map.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroField metadata = rootType.findField("metadata");
        assertThat(metadata.getType().getFieldType()).isEqualTo(FieldType.BASIC);
        assertThat(metadata.getType().getTypeName()).isEqualTo("string");
        assertThat(metadata.getType().getWrapperFieldType()).isEqualTo(FieldType.MAP);
    }

    @Test
    void schemaStringOnly() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/type_string.json"), AvroSchemaVersion.class);
        assertThat(avroSchemaVersion.getVersion()).isEqualTo(3);

        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        assertThat(avroSchema.getTopicName()).isEqualTo("aapen-syfo-test");
        assertThat(rootType.getFieldType()).isEqualTo(FieldType.BASIC);
        assertThat(rootType.getTypeName()).isEqualTo("string");
        assertThat(rootType.getFields()).isEqualTo(Collections.emptyList());
    }

    @Test
    void testWithRecursiveStructure() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/type_with_recursive_structure.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        assertThat(rootType.getFieldType()).isEqualTo(FieldType.OBJECT);
        assertThat(rootType.getTypeName()).isEqualTo("PensjonsgivendeInntekt");
        AvroField fastlandsinntekt = rootType.findField("fastlandsinntekt");
        assertThat(fastlandsinntekt.getType().getFieldType()).isEqualTo(FieldType.OBJECT);
        assertThat(fastlandsinntekt.getType().getTypeName()).isEqualTo("Fastlandsinntekt");
        AvroField personinntektLoenn = fastlandsinntekt.getType().findField("personinntektLoenn");
        assertThat(personinntektLoenn.getType().getFieldType()).isEqualTo(FieldType.BASIC);
        assertThat(personinntektLoenn.getType().getTypeName()).isEqualTo("long");

        assertThat(avroSchema.getAllTypes().stream().map(AvroType::getTypeName)).contains("PensjonsgivendeInntekt", "Fastlandsinntekt", "Svalbardinntekt");
    }

    @Test
    void testNullable() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroField nullable = rootType.findField("emailAddresses").getType().findField("dateBounced");
        assertThat(nullable.getType().getFieldType()).isEqualTo(FieldType.BASIC);
        assertThat(nullable.getType().getTypeName()).isEqualTo("long");
        assertThat(nullable.isNullable()).isTrue();
    }

    @Test
    void testArray() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroField arrayType = rootType.findField("emailAddresses");
        assertThat(arrayType.getType().getFieldType()).isEqualTo(FieldType.OBJECT);
        assertThat(arrayType.getType().getTypeName()).isEqualTo("EmailAddress");
        assertThat(arrayType.getType().getWrapperFieldType()).isEqualTo(FieldType.ARRAY);
        assertThat(arrayType.getType().getFields()).hasSize(4);
    }

    @Test
    void testRecursive() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroField toDoItems = rootType.findField("toDoItems").getType().findField("subItems");
        assertTrue(toDoItems.getType().getStub());
        assertThat(toDoItems.getType().getFields()).hasSize(0);

        assertThat(avroSchema.getAllTypes().stream().map(AvroType::getTypeName)).contains("User", "EmailAddress", "TwitterAccount", "OAuthStatus", "ToDoItem", "ToDoStatus");
    }

    @Test
    void testUnion() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroType toDoItems = rootType.findField("toDoItems").getType();

        AvroField unionFieldOne = toDoItems.findField("unionField", 1);
        assertThat(unionFieldOne.getType().getTypeName()).isEqualTo("long");

        AvroField unionFieldTwo = toDoItems.findField("unionField", 2);
        assertThat(unionFieldTwo.getType().getTypeName()).isEqualTo("ToDoItem");
    }
}