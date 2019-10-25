package no.nav.data.polly.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Data;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.elasticsearch.domain.InformationTypeElasticsearch;

@Data
@AllArgsConstructor
public class ElasticsearchDocument {

    private String id;
    private String json;
    private String index;

    public static ElasticsearchDocument newDocument(InformationTypeElasticsearch data, String index) {
        return new ElasticsearchDocument(data.getId(), JsonUtils.toJson(data), index);
    }

    public static ElasticsearchDocument newDocumentId(String id, String index) {
        return new ElasticsearchDocument(id, null, index);
    }
}
