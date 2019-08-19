package no.nav.data.catalog.backend.app.kafka.schema;

import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.kafka.schema.Domain.AvroSchemaField;
import no.nav.data.catalog.backend.app.kafka.schema.Domain.SubjectVersion;
import org.junit.Test;

import java.util.Collections;

import static no.nav.data.catalog.backend.app.TestUtil.readFile;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class AvroSchemaParserTest {

    private AvroSchemaParser parser = new AvroSchemaParser();

    @Test
    public void testEnum() {
        SubjectVersion subjectVersion = JsonUtils.toObject(readFile("kafka/schema/type_with_enum.json"), SubjectVersion.class);
        parser.parseTopicSchema(subjectVersion);

        System.out.println(subjectVersion);

        assertThat(subjectVersion.getTypeData().getType(), is("ProduceTask"));
        AvroSchemaField enumField = subjectVersion.getTypeData().findField("prioritet");
        assertThat(enumField.getAvroSchemaType().getType(), is("enum PrioritetType[HOY, NORM, LAV]"));
    }

    @Test
    public void testWithRecursiveStructure() {
        SubjectVersion subjectVersion = JsonUtils.toObject(readFile("kafka/schema/type_with_recursive_structure.json"), SubjectVersion.class);
        parser.parseTopicSchema(subjectVersion);

        System.out.println(subjectVersion);

        assertThat(subjectVersion.getTypeData().getType(), is("PensjonsgivendeInntekt"));
        AvroSchemaField fastlandsinntekt = subjectVersion.getTypeData().findField("fastlandsinntekt");
        assertThat(fastlandsinntekt.getAvroSchemaType().getType(), is("Fastlandsinntekt"));
        AvroSchemaField personinntektLoenn = fastlandsinntekt.getAvroSchemaType().findField("personinntektLoenn");
        assertThat(personinntektLoenn.getAvroSchemaType().getType(), is("boolean"));
    }

    @Test
    public void schemaStringOnly() {
        SubjectVersion subjectVersion = JsonUtils.toObject(readFile("kafka/schema/type_string.json"), SubjectVersion.class);
        parser.parseTopicSchema(subjectVersion);

        System.out.println(subjectVersion);

        assertThat(subjectVersion.getTopic(), is("aapen-syfo-test"));
        assertThat(subjectVersion.getVersion(), is(3));
        assertThat(subjectVersion.getTypeData().getType(), is("string"));
        assertThat(subjectVersion.getTypeData().getFields(), is(Collections.emptyList()));
    }
}