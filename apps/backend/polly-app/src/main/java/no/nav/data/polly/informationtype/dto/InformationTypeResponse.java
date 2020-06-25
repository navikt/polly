package no.nav.data.polly.informationtype.dto;


import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.rest.ChangeStampResponse;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;

import java.util.List;
import java.util.UUID;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"id", "name", "term", "description", "sensitivity", "orgMaster", "categories", "sources", "keywords", "changeStamp"})
public class InformationTypeResponse {

    private UUID id;
    private String name;
    private String term;
    private String description;
    private CodelistResponse sensitivity;
    private CodelistResponse orgMaster;
    private List<CodelistResponse> categories;
    private List<CodelistResponse> sources;
    private List<String> keywords;
    private ChangeStampResponse changeStamp;

    public InformationTypeResponse(InformationType informationType) {
        id = informationType.getId();
        setTerm(informationType.getTermId());
        mapJsonFields(informationType.getData());
        setChangeStamp(informationType.convertChangeStampResponse());
    }

    private void mapJsonFields(@NotNull InformationTypeData data) {
        setName(data.getName());
        setDescription(data.getDescription());
        setSensitivity(CodelistService.getCodelistResponse(ListName.SENSITIVITY, data.getSensitivity()));
        setOrgMaster(CodelistService.getCodelistResponse(ListName.SYSTEM, data.getOrgMaster()));
        setCategories(CodelistService.getCodelistResponseList(ListName.CATEGORY, data.getCategories()));
        setSources(CodelistService.getCodelistResponseList(ListName.THIRD_PARTY, data.getSources()));
        setKeywords(copyOf(data.getKeywords()));
    }

}
