package no.nav.data.catalog.backend.app.kafka.schema;

import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchema;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaField;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaType;
import no.nav.data.catalog.backend.app.kafka.schema.domain.AvroSchemaVersion;
import no.nav.data.catalog.backend.app.kafka.schema.domain.FieldType;
import org.junit.Test;

import java.util.Collections;

import static no.nav.data.catalog.backend.app.TestUtil.readFile;
import static org.hamcrest.CoreMatchers.hasItems;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class AvroSchemaParserTest {

    @Test
    public void testEnum() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroSchemaType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroSchemaField enumField = rootType.findField("toDoItems").getType().findField("status");
        assertThat(enumField.getType().getFieldType(), is(FieldType.ENUM));
        assertThat(enumField.getType().getTypeName(), is("ToDoStatus"));
        assertThat(enumField.getType().getEnumValues(), hasItems("HIDDEN", "ACTIONABLE", "DONE", "ARCHIVED", "DELETED"));
    }

    @Test
    public void testMap() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/type_with_map.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroSchemaType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroSchemaField metadata = rootType.findField("metadata");
        assertThat(metadata.getType().getFieldType(), is(FieldType.BASIC));
        assertThat(metadata.getType().getTypeName(), is("string"));
        assertThat(metadata.getType().getWrapperFieldType(), is(FieldType.MAP));
    }

    @Test
    public void schemaStringOnly() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/type_string.json"), AvroSchemaVersion.class);
        assertThat(avroSchemaVersion.getVersion(), is(3));

        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroSchemaType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        assertThat(avroSchema.getTopicName(), is("aapen-syfo-test"));
        assertThat(rootType.getFieldType(), is(FieldType.BASIC));
        assertThat(rootType.getTypeName(), is("string"));
        assertThat(rootType.getFields(), is(Collections.emptyList()));
    }

    @Test
    public void testWithRecursiveStructure() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/type_with_recursive_structure.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroSchemaType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        assertThat(rootType.getFieldType(), is(FieldType.OBJECT));
        assertThat(rootType.getTypeName(), is("PensjonsgivendeInntekt"));
        AvroSchemaField fastlandsinntekt = rootType.findField("fastlandsinntekt");
        assertThat(fastlandsinntekt.getType().getFieldType(), is(FieldType.OBJECT));
        assertThat(fastlandsinntekt.getType().getTypeName(), is("Fastlandsinntekt"));
        AvroSchemaField personinntektLoenn = fastlandsinntekt.getType().findField("personinntektLoenn");
        assertThat(personinntektLoenn.getType().getFieldType(), is(FieldType.BASIC));
        assertThat(personinntektLoenn.getType().getTypeName(), is("long"));
    }

    @Test
    public void testNullable() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroSchemaType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroSchemaField nullable = rootType.findField("emailAddresses").getType().findField("dateBounced");
        assertThat(nullable.getType().getFieldType(), is(FieldType.BASIC));
        assertThat(nullable.getType().getTypeName(), is("long"));
    }

    @Test
    public void testArray() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroSchemaType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroSchemaField arrayType = rootType.findField("emailAddresses");
        assertThat(arrayType.getType().getFieldType(), is(FieldType.OBJECT));
        assertThat(arrayType.getType().getTypeName(), is("EmailAddress"));
        assertThat(arrayType.getType().getWrapperFieldType(), is(FieldType.ARRAY));
        assertThat(arrayType.getType().getFields(), hasSize(4));
    }

    @Test
    public void testRecursive() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroSchemaType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroSchemaField toDoItems = rootType.findField("toDoItems").getType().findField("subItems");
        assertTrue(toDoItems.getType().getStub());
        assertThat(toDoItems.getType().getFields(), hasSize(0));
    }

    @Test
    public void testUnion() {
        AvroSchemaVersion avroSchemaVersion = JsonUtils.toObject(readFile("kafka/schema/avroDocExample.json"), AvroSchemaVersion.class);
        AvroSchema avroSchema = AvroSchemaParser.parseSchema(avroSchemaVersion);
        AvroSchemaType rootType = avroSchema.getRootType();

        System.out.println(rootType);

        AvroSchemaType unionField = rootType.findField("toDoItems").getType().findField("unionField").getType();
        assertThat(unionField.getFieldType(), is(FieldType.UNION));
        assertThat(unionField.getFields(), hasSize(2));

        assertThat(unionField.getFields().get(0).getUnionOrdinal(), is(1));
        assertThat(unionField.getFields().get(0).getName(), is("long"));
        assertThat(unionField.getFields().get(0).getType().getTypeName(), is("long"));

        assertThat(unionField.getFields().get(1).getUnionOrdinal(), is(2));
        assertThat(unionField.getFields().get(1).getName(), is("ToDoItem"));
        assertThat(unionField.getFields().get(1).getType().getTypeName(), is("ToDoItem"));
    }
}