package no.nav.data.polly.term;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Value;

@Value
@JsonPropertyOrder({"id", "name", "description"})
public class TermResponse {

    private String id;
    private String name;
    private String description;
}
