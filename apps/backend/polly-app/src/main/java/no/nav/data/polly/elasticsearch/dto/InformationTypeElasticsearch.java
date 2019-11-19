package no.nav.data.polly.elasticsearch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InformationTypeElasticsearch {

    private UUID id;
    private String name;
    private String term;
    private String description;
    private CodelistResponse sensitivity;
    private CodelistResponse navMaster;
    private List<CodelistResponse> categories = new ArrayList<>();
    private List<CodelistResponse> sources = new ArrayList<>();
    private List<String> keywords = new ArrayList<>();

    private String modified;
    private String modifiedBy;
    private String created;
    private String createdBy;

    private List<ProcessElasticsearch> processes = new ArrayList<>();
    // Mapped from policies
    private List<String> purpose = new ArrayList<>();
    private List<String> legalbasis = new ArrayList<>();

    // Mapped
    private String suggest;

    public InformationTypeElasticsearch(InformationType informationType, List<ProcessElasticsearch> processes) {
        setId(informationType.getId());
        setTerm(informationType.getTerm() == null ? null : informationType.getTerm().getName());

        setCreated(DateUtil.formatDateTime(informationType.getCreatedDate()));
        setCreatedBy(informationType.getCreatedBy());
        setModified(DateUtil.formatDateTime(informationType.getLastModifiedDate()));
        setModifiedBy(informationType.getLastModifiedBy());

        setProcesses(processes);
        processes.forEach(process -> {
            getPurpose().add(process.getPurpose());
            getLegalbasis().add(safeStream(process.getLegalbases()).filter(LegalBasisElasticsearch::isActive)
                    .map(LegalBasisElasticsearch::toShortForm).collect(Collectors.joining(", ")));
            getLegalbasis().add(safeStream(process.getPolicies()).flatMap(policy -> policy.getLegalbases().stream()).filter(LegalBasisElasticsearch::isActive)
                    .map(LegalBasisElasticsearch::toShortForm).collect(Collectors.joining(", ")));
        });

        mapJsonFields(informationType.getData());
    }

    private void mapJsonFields(InformationTypeData data) {
        setName(data.getName());
        setDescription(data.getDescription());
        setSensitivity(CodelistService.getCodelistResponse(ListName.SENSITIVITY, data.getSensitivity()));
        setNavMaster(CodelistService.getCodelistResponse(ListName.SYSTEM, data.getNavMaster()));
        setCategories(CodelistService.getCodelistResponseList(ListName.CATEGORY, data.getCategories()));
        setSources(CodelistService.getCodelistResponseList(ListName.SOURCE, data.getSources()));
        setKeywords(copyOf(data.getKeywords()));

        setSuggest(String.format("%s %s %s", name, StringUtils.trimToEmpty(description), String.join(" ", nullToEmptyList(keywords))));
    }

}
