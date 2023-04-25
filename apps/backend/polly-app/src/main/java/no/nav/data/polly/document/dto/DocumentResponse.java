package no.nav.data.polly.document.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "informationTypes"})
public class DocumentResponse {

    private UUID id;
    private String name;
    private String description;
    @Singular
    private List<DocumentInfoTypeUseResponse> informationTypes;
    private CodelistResponse dataAccessClass;

}
