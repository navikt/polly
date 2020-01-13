package no.nav.data.polly.document.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "informationTypeIds", "informationTypes"})
public class DocumentResponse {

    private UUID id;
    private String name;
    private String description;
    private List<UUID> informationTypeIds;
    @Singular
    private List<DocumentInformationTypeResponse> informationTypes;

}
