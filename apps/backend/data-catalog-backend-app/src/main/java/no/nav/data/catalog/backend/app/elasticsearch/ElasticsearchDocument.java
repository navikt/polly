package no.nav.data.catalog.backend.app.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Data;
import no.nav.data.catalog.backend.app.common.utils.Constants;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.dataset.DatasetResponse;

@Data
@AllArgsConstructor
public class ElasticsearchDocument<T> {

    private String id;
    private String json;
    private Class<T> type;
    private String index;

    public static ElasticsearchDocument<DatasetResponse> newDatasetDocument(DatasetResponse dataset) {
        return new ElasticsearchDocument<>(dataset.getElasticsearchId(), JsonUtils.toJson(dataset), DatasetResponse.class, Constants.DATASET_ELASTICSEARCH_INDEX);
    }

    public static ElasticsearchDocument newDatasetDocumentId(String id) {
        return new ElasticsearchDocument<>(id, null, DatasetResponse.class, Constants.DATASET_ELASTICSEARCH_INDEX);
    }
}
