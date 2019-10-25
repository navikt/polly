package no.nav.data.polly.elasticsearch.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.codelist.CodeResponse;
import no.nav.data.polly.codelist.CodelistService;
import no.nav.data.polly.codelist.ListName;
import no.nav.data.polly.common.utils.DateUtil;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.InformationTypeData;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static no.nav.data.polly.common.utils.StreamUtils.copyOf;
import static no.nav.data.polly.common.utils.StreamUtils.nullToEmptyList;
import static no.nav.data.polly.common.utils.StreamUtils.safeStream;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class InformationTypeElasticsearch {

    private String id;
    private String name;
    private String context;
    private String description;
    private String pii;
    private String sensitivity;
    private List<CodeResponse> categories = new ArrayList<>();
    private List<CodeResponse> sources = new ArrayList<>();
    private List<String> keywords = new ArrayList<>();

    private String modified;
    private String modifiedBy;
    private String created;
    private String createdBy;

    private List<PolicyElasticsearch> policies = new ArrayList<>();
    // Mapped from policies
    private List<String> purpose = new ArrayList<>();
    private List<String> legalbasis = new ArrayList<>();

    // Mapped
    private String suggest;

    public InformationTypeElasticsearch(InformationType informationType, List<PolicyElasticsearch> policies) {
        setId(informationType.getId().toString());

        setCreated(DateUtil.formatDateTime(informationType.getCreatedDate()));
        setCreatedBy(informationType.getCreatedBy());
        setModified(DateUtil.formatDateTime(informationType.getLastModifiedDate()));
        setModifiedBy(informationType.getLastModifiedBy());

        setPolicies(policies);
        policies.forEach(policy -> {
            getPurpose().add(policy.getPurpose());
            getLegalbasis().add(safeStream(policy.getLegalbases()).map(LegalBasisElasticSearch::getNationalLaw).collect(Collectors.joining(", ")));
        });

        mapJsonFields(informationType.getData());
    }

    private void mapJsonFields(InformationTypeData data) {
        setName(data.getName());
        setContext(data.getContext());
        setDescription(data.getDescription());
        setPii(data.getPii());
        setSensitivity(data.getSensitivity());
        setCategories(CodelistService.getCodeResponseForCodelistItems(ListName.CATEGORY, data.getCategories()));
        setSources(CodelistService.getCodeResponseForCodelistItems(ListName.SOURCE, data.getSources()));
        setKeywords(copyOf(data.getKeywords()));

        setSuggest(String.format("%s %s %s", name, StringUtils.trimToEmpty(description), String.join(" ", nullToEmptyList(keywords))));
    }

}
