package no.nav.data.polly.document.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "sensitivity"})
public class DocumentInfoTypeResponse {

    private UUID id;
    private String name;
    private CodelistResponse sensitivity;
}
