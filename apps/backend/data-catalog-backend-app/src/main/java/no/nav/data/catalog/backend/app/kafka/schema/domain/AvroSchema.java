package no.nav.data.catalog.backend.app.kafka.schema.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "allTypes")
public class AvroSchema {

    private String topicName;
    private AvroSchemaType rootType;
    // First occurance of the type is stored here to give access to all individual types
    private Set<AvroSchemaType> allTypes;
}
