package no.nav.data.polly.informationtype.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodeResponse;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.ListName;

import java.util.List;
import java.util.UUID;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonPropertyOrder({"id", "title"})
public class InformationTypeResponse {

    private UUID id;
    private String name;
    private String context;
    private String description;
    private String pii;
    private String sensitivity;
    private List<CodeResponse> categories;
    private List<CodeResponse> sources;
    private List<String> keywords;

    private InformationTypeMaster informationTypeMaster;

    InformationTypeResponse(InformationType informationType) {
        id = informationType.getId();
        mapJsonFields(informationType.getData());
    }

    private void mapJsonFields(@NotNull InformationTypeData data) {
        setName(data.getName());
        setContext(data.getContext());
        setDescription(data.getDescription());
        setPii(data.getPii());
        setSensitivity(data.getSensitivity());
        setCategories(CodelistService.getCodeResponseForCodelistItems(ListName.CATEGORY, data.getCategories()));
        setSources(CodelistService.getCodeResponseForCodelistItems(ListName.PROVENANCE, data.getSources()));
        setKeywords(copyOf(data.getKeywords()));
        setInformationTypeMaster(data.getInformationTypeMaster());
    }

}
