package no.nav.data.polly.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Data;
import no.nav.data.polly.common.utils.JsonUtils;
import no.nav.data.polly.elasticsearch.domain.DatasetElasticsearch;

@Data
@AllArgsConstructor
public class ElasticsearchDocument {

    private String id;
    private String json;
    private String index;

    public static ElasticsearchDocument newDatasetDocument(DatasetElasticsearch dataset, String index) {
        return new ElasticsearchDocument(dataset.getId().toString(), JsonUtils.toJson(dataset), index);
    }

    public static ElasticsearchDocument newDatasetDocumentId(String id, String index) {
        return new ElasticsearchDocument(id, null, index);
    }
}
