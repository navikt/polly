package no.nav.data.catalog.backend.app.elasticsearch;

import static no.nav.data.catalog.backend.app.common.utils.Constants.ES_DOC_TYPE;
import static no.nav.data.catalog.backend.app.common.utils.Constants.INFORMATION_TYPE_INDEX;

import java.io.IOException;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.catalog.backend.app.common.exceptions.DataCatalogBackendTechnicalException;
import no.nav.data.catalog.backend.app.common.exceptions.DocumentNotFoundException;
import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.AbstractQueryBuilder;
import org.elasticsearch.index.query.MatchAllQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ElasticsearchRepository {

    private RequestOptions requestOptions = RequestOptions.DEFAULT.toBuilder().build();

    private final RestHighLevelClient restHighLevelClient;

    public ElasticsearchRepository(RestHighLevelClient restHighLevelClient) {
        this.restHighLevelClient = restHighLevelClient;
    }

    public void insertInformationType(Map<String, Object> jsonMap) {
        insert(jsonMap, INFORMATION_TYPE_INDEX);
    }

    public Map<String, Object> getInformationTypeById(String id) {
        return getById(id, INFORMATION_TYPE_INDEX);
    }

    public void updateInformationTypeById(String id, Map<String, Object> jsonMap) {
        updateById(id, jsonMap, INFORMATION_TYPE_INDEX);
    }

    public void deleteInformationTypeById(String id) {
        deleteById(id, INFORMATION_TYPE_INDEX);
    }

    public SearchResponse searchByField(String fieldName, String fieldValue) {
        AbstractQueryBuilder query = new MatchQueryBuilder(fieldName, fieldValue);
        return searchByQuery(query, INFORMATION_TYPE_INDEX);
    }

    public SearchResponse getAllInformationTypes() {
        AbstractQueryBuilder query = new MatchAllQueryBuilder();
        return searchByQuery(query, INFORMATION_TYPE_INDEX);
    }

    private void insert(Map<String, Object> jsonMap, String index) {
        String id = jsonMap.get("id").toString();
        log.info("insert: Insert new {} with document id={}", index, id);
        IndexRequest indexRequest = new IndexRequest(index, ES_DOC_TYPE, id);
        indexRequest.source(jsonMap);

        try {
            restHighLevelClient.index(indexRequest, requestOptions);
            log.info("insert: {} inserted", index);
        } catch (ElasticsearchException e) {
            log.error("Elasticsearch-error occurred during insert " + index, e);
            throw new DataCatalogBackendTechnicalException(e.getDetailedMessage(), e);
        } catch (IOException ex) {
            log.error("Error occurred during insert " + index, ex);
            throw new DataCatalogBackendTechnicalException(ex.getLocalizedMessage(), ex);
        }
    }

    private Map<String, Object> getById(String id, String index) {
        log.info("getById: Received request for {} with document id={}", index, id);
        GetRequest getRequest = new GetRequest(index, ES_DOC_TYPE, id);
        GetResponse getResponse;

        try {
            getResponse = restHighLevelClient.get(getRequest, requestOptions);
            if (getResponse.isSourceEmpty()) {
                log.error("getById: Could not find a {} document to retrieve, document id={}", index, id);
                throw new DocumentNotFoundException(String.format("Could not find a document to retrieve, document id=%s", id));
            }
        } catch (IOException ex) {
            log.error(String.format("Error occurred during getById, %s document id=%s", index, id), ex);
            throw new DataCatalogBackendTechnicalException(ex.getLocalizedMessage(), ex);
        }
        log.info("getById: Returned {}", index);
        return getResponse.getSourceAsMap();
    }

    private void updateById(String id, Map<String, Object> jsonMap, String index) {
        log.info("updateById: Request to update {} with document id={}", index, id);
        UpdateRequest updateRequest = new UpdateRequest(index, ES_DOC_TYPE, id);
        updateRequest.fetchSource(true);
        updateRequest.doc(jsonMap);

        try {
            restHighLevelClient.update(updateRequest, requestOptions);
            log.info("updateById: Updated {} with document id={}", index, id);
        } catch (ElasticsearchException e) {
            if (e.status() == RestStatus.NOT_FOUND) {
                log.info("updateById: {} with document id={} does not exist. Will try to insert {} instead", index, id, index);
                IndexRequest indexRequest = new IndexRequest(INFORMATION_TYPE_INDEX, ES_DOC_TYPE, jsonMap.get("id").toString());
                indexRequest.source(jsonMap);
                try {
                    restHighLevelClient.index(indexRequest, requestOptions);
                } catch (IOException ex) {
                    log.error(String.format("Error occurred during indexing, document id=%s", jsonMap.get("id").toString()), ex);
                    throw new DataCatalogBackendTechnicalException(ex.getLocalizedMessage(), ex);
                }
            } else {
                log.error(String.format("Error occurred during updateById, %s document id=%s", index, id), e);
                throw new DataCatalogBackendTechnicalException(e.getLocalizedMessage(), e);
            }
        } catch (IOException ex) {
            log.error(String.format("IOException occurred during updateById, %s document id=%s", index, id), ex);
            throw new DataCatalogBackendTechnicalException(ex.getLocalizedMessage(), ex);
        }
    }

    private void deleteById(String id, String index) {
        log.info("deleteById: Request to delete {} with document id={}", index, id);
        DeleteRequest deleteRequest = new DeleteRequest(index, ES_DOC_TYPE, id);

        try {
            DeleteResponse deleteResponse = restHighLevelClient.delete(deleteRequest, requestOptions);
            log.info("deleteById: Deleted {}, document id={}", index, id);
            if (deleteResponse.getResult() == DocWriteResponse.Result.NOT_FOUND) {
                log.error("deleteById: Could not find a {} document to delete, document id={}", index, id);
                throw new DocumentNotFoundException(String.format("Could not find a document to delete, document id=%s", id));
            }
        } catch (IOException ex) {
            log.error(String.format("IOException occurred during deleteById, %s document id=%s", index, id), ex);
            ex.getLocalizedMessage();
        }
    }

    private SearchResponse searchByQuery(AbstractQueryBuilder query, String index) {
        SearchRequest searchRequest = new SearchRequest();
        searchRequest.indices(index);

        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(query);
        searchRequest.source(searchSourceBuilder);

        try {
            return restHighLevelClient.search(searchRequest, requestOptions);
        } catch (IOException ex) {
            ex.getLocalizedMessage();
        }
        return null;
    }
}
