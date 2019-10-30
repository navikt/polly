package no.nav.data.polly.informationtype.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.informationtype.domain.InformationTypeMaster;

import java.util.List;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"id", "name"})
public class InformationTypeResponse {

    private String id;
    private String name;
    private String context;
    private String description;
    private String pii;
    private String sensitivity;
    private List<CodeResponse> categories;
    private List<CodeResponse> sources;
    private List<String> keywords;

    private InformationTypeMaster informationTypeMaster;

    public InformationTypeResponse(InformationType informationType) {
        id = informationType.getId().toString();
        mapJsonFields(informationType.getData());
    }

    private void mapJsonFields(@NotNull InformationTypeData data) {
        setName(data.getName());
        setContext(data.getContext());
        setDescription(data.getDescription());
        setPii(data.getPii());
        setSensitivity(data.getSensitivity());
        setCategories(CodelistService.getCodeResponseForCodelistItems(ListName.CATEGORY, data.getCategories()));
        setSources(CodelistService.getCodeResponseForCodelistItems(ListName.SOURCE, data.getSources()));
        setKeywords(copyOf(data.getKeywords()));
        setInformationTypeMaster(data.getInformationTypeMaster());
    }

}
