package no.nav.data.polly.document.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.document.domain.Document;
import no.nav.data.polly.document.domain.DocumentData;

import java.util.List;
import java.util.UUID;

import static no.nav.data.common.utils.StreamUtils.convert;

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

    public static DocumentResponse buildFrom(Document d) {
        DocumentData data = d.getData();
        return DocumentResponse.builder()
                .id(d.getId())
                .name(data.getName())
                .description(data.getDescription())
                .informationTypes(convert(data.getInformationTypes(), Document::convertToInfoTypeUseResponse))
                .dataAccessClass(CodelistService.getCodelistResponse(ListName.DATA_ACCESS_CLASS, data.getDataAccessClass()))
                .build();
    }
    
}
