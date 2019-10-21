package no.nav.polly.kafka.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultCode {

    private int intValue;
    private String name;
    private String stringRepresentation;
}
