package no.nav.polly.kafka.schema.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AvroSchemaVersion {

    private Integer id;
    private String schema;
    private String subject;
    private Integer version;

}
