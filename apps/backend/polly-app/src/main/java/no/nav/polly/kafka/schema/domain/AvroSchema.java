package no.nav.polly.kafka.schema.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private AvroType rootType;
    // First occurance of the type is stored here to give access to all individual types
    @JsonIgnore
    private Set<AvroType> allTypes;
}
