package no.nav.data.polly.document.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"informationTypeId", "informationType", "subjectCategories"})
public class DocumentInfoTypeUseResponse {

    private UUID informationTypeId;
    private InformationTypeShortResponse informationType;
    @Singular
    private List<CodelistResponse> subjectCategories;

}
