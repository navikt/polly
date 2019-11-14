package no.nav.data.polly.term.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name"})
public class TermIdNameResponse {

    private UUID id;
    private String name;

}
