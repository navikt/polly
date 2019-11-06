package no.nav.data.polly.elasticsearch.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.elasticsearch.dto.InformationTypeElasticsearch;

@Data
@AllArgsConstructor
public class ElasticsearchDocument {

    private String id;
    private String json;
    private String index;

    public static ElasticsearchDocument newDocument(InformationTypeElasticsearch data, String index) {
        return new ElasticsearchDocument(data.getId().toString(), JsonUtils.toJson(data), index);
    }

    public static ElasticsearchDocument newDocumentId(String id, String index) {
        return new ElasticsearchDocument(id, null, index);
    }
}
