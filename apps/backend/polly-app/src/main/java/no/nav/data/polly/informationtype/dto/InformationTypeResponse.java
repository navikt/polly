package no.nav.data.polly.informationtype.dto;


import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import io.swagger.annotations.ApiParam;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import org.apache.commons.lang3.BooleanUtils;

import java.util.List;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"id", "name", "term", "description", "pii", "sensitivity", "categories", "sources", "keywords"})
public class InformationTypeResponse {

    private String id;
    private String name;
    private String term;
    private String description;
    @ApiParam(type = "boolean")
    private String pii;
    private CodeResponse sensitivity;
    private List<CodeResponse> categories;
    private List<CodeResponse> sources;
    private List<String> keywords;

    public InformationTypeResponse(InformationType informationType) {
        id = informationType.getId().toString();
        setTerm(informationType.getTerm() == null ? null : informationType.getTerm().getName());
        mapJsonFields(informationType.getData());
    }

    private void mapJsonFields(@NotNull InformationTypeData data) {
        setName(data.getName());
        setDescription(data.getDescription());
        setPii(BooleanUtils.toStringTrueFalse(data.isPii()));
        setSensitivity(CodelistService.getCodeResponseForCodelistItem(ListName.SENSITIVITY, data.getSensitivity()));
        setCategories(CodelistService.getCodeResponseForCodelistItems(ListName.CATEGORY, data.getCategories()));
        setSources(CodelistService.getCodeResponseForCodelistItems(ListName.SOURCE, data.getSources()));
        setKeywords(copyOf(data.getKeywords()));
    }

}
