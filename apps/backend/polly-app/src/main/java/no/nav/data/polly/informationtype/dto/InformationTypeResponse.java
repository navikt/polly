package no.nav.data.polly.informationtype.dto;


import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeResponse;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchStatus;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import no.nav.data.polly.term.dto.TermIdNameResponse;

import java.util.List;
import java.util.UUID;
import javax.validation.constraints.NotNull;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"id", "name", "term", "description", "pii", "sensitivity", "navMaster", "categories", "sources", "keywords", "toBeDeleted"})
public class InformationTypeResponse {

    private UUID id;
    private String name;
    private TermIdNameResponse term;
    private String description;
    private boolean pii;
    private CodeResponse sensitivity;
    private CodeResponse navMaster;
    private List<CodeResponse> categories;
    private List<CodeResponse> sources;
    private List<String> keywords;
    private boolean toBeDeleted;

    public InformationTypeResponse(InformationType informationType) {
        id = informationType.getId();
        setTerm(informationType.getTerm() == null ? null : informationType.getTerm().convertToIdNameResponse());
        setToBeDeleted(informationType.getElasticsearchStatus() == ElasticsearchStatus.TO_BE_DELETED);
        mapJsonFields(informationType.getData());
    }

    private void mapJsonFields(@NotNull InformationTypeData data) {
        setName(data.getName());
        setDescription(data.getDescription());
        setPii(data.isPii());
        setSensitivity(CodelistService.getCodeResponse(ListName.SENSITIVITY, data.getSensitivity()));
        setNavMaster(CodelistService.getCodeResponse(ListName.SYSTEM, data.getNavMaster()));
        setCategories(CodelistService.getCodeResponseList(ListName.CATEGORY, data.getCategories()));
        setSources(CodelistService.getCodeResponseList(ListName.SOURCE, data.getSources()));
        setKeywords(copyOf(data.getKeywords()));
    }

}
