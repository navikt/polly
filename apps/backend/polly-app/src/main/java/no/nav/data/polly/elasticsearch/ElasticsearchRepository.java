package no.nav.data.polly.elasticsearch;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.common.exceptions.DocumentNotFoundException;
import no.nav.data.polly.common.exceptions.PollyTechnicalException;
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
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.AbstractQueryBuilder;
import org.elasticsearch.index.query.MatchAllQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.rest.RestStatus;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

import java.io.IOException;

import static no.nav.data.polly.common.utils.Constants.ES_DOC_TYPE;

@Slf4j
@Service
public class ElasticsearchRepository {

    private RequestOptions requestOptions = RequestOptions.DEFAULT.toBuilder().build();

    private final RestHighLevelClient restHighLevelClient;

    public ElasticsearchRepository(RestHighLevelClient restHighLevelClient) {
        this.restHighLevelClient = restHighLevelClient;
    }

    public SearchResponse searchInformationTypesByField(String fieldName, String fieldValue, String index) {
        AbstractQueryBuilder query = new MatchQueryBuilder(fieldName, fieldValue);
        return searchByQuery(query, index);
    }

    public SearchResponse getAllInformationTypes(String index) {
        AbstractQueryBuilder query = new MatchAllQueryBuilder();
        return searchByQuery(query, index);
    }

    public void insert(ElasticsearchDocument document) {
        String index = document.getIndex();
        String id = document.getId();
        log.info("insert: Insert new {} with document id={}", index, id);
        IndexRequest indexRequest = new IndexRequest(index, ES_DOC_TYPE, id);
        indexRequest.source(document.getJson(), XContentType.JSON);

        try {
            restHighLevelClient.index(indexRequest, requestOptions);
            log.info("insert: {} inserted", index);
        } catch (ElasticsearchException e) {
            log.error("Elasticsearch-error occurred during insert " + index, e);
            throw new PollyTechnicalException(e.getDetailedMessage(), e);
        } catch (IOException ex) {
            log.error("Error occurred during insert " + index, ex);
            throw new PollyTechnicalException(ex.getLocalizedMessage(), ex);
        }
    }

    public String getById(ElasticsearchDocument document) {
        String index = document.getIndex();
        String id = document.getId();
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
            throw new PollyTechnicalException(ex.getLocalizedMessage(), ex);
        }
        log.info("getById: Returned {}", index);
        return getResponse.getSourceAsString();
    }

    public void updateById(ElasticsearchDocument document) {
        String index = document.getIndex();
        String id = document.getId();
        log.info("updateById: Request to update {} with document id={}", index, id);
        UpdateRequest updateRequest = new UpdateRequest(index, ES_DOC_TYPE, id);
        updateRequest.fetchSource(true);
        updateRequest.doc(document.getJson(), XContentType.JSON);

        try {
            restHighLevelClient.update(updateRequest, requestOptions);
            log.info("updateById: Updated {} with document id={}", index, id);
        } catch (ElasticsearchException e) {
            if (e.status() == RestStatus.NOT_FOUND) {
                log.info("updateById: {} with document id={} does not exist. Will try to insert {} instead", index, id, index);
                IndexRequest indexRequest = new IndexRequest(index, ES_DOC_TYPE, id);
                indexRequest.source(document.getJson(), XContentType.JSON);
                try {
                    restHighLevelClient.index(indexRequest, requestOptions);
                } catch (IOException ex) {
                    log.error(String.format("Error occurred during indexing, document id=%s", id), ex);
                    throw new PollyTechnicalException(ex.getLocalizedMessage(), ex);
                }
            } else {
                log.error(String.format("Error occurred during updateById, %s document id=%s", index, id), e);
                throw new PollyTechnicalException(e.getLocalizedMessage(), e);
            }
        } catch (IOException ex) {
            log.error(String.format("IOException occurred during updateById, %s document id=%s", index, id), ex);
            throw new PollyTechnicalException(ex.getLocalizedMessage(), ex);
        }
    }

    public void deleteById(ElasticsearchDocument document) {
        String index = document.getIndex();
        String id = document.getId();
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

    public SearchResponse searchByQuery(AbstractQueryBuilder query, String index) {
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
