package no.nav.data.catalog.backend.app.elasticsearch;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

import static no.nav.data.catalog.backend.app.common.utils.Constants.INDEX;
import static no.nav.data.catalog.backend.app.common.utils.Constants.TYPE;

@Slf4j
@Service
public class ElasticsearchRepository {

	private static final Logger logger = LoggerFactory.getLogger(ElasticsearchRepository.class);
	private RequestOptions requestOptions = RequestOptions.DEFAULT.toBuilder().build();

	@Autowired
	RestHighLevelClient restHighLevelClient;

	public void insertInformationType(Map<String, Object> jsonMap) {
		IndexRequest indexRequest = new IndexRequest(INDEX, TYPE, jsonMap.get("id").toString());
		indexRequest.source(jsonMap);

		try {
			restHighLevelClient.index(indexRequest, requestOptions);
		} catch (ElasticsearchException e) {
			logger.error("Elasticsearch-error occurred during insertInformationType", e);
			throw new DataCatalogBackendTechnicalException(e.getDetailedMessage(), e);
		} catch (IOException ex) {
			logger.error("Error occurred during insertInformationType", ex);
			throw new DataCatalogBackendTechnicalException(ex.getLocalizedMessage(), ex);
		}
	}

	public Map<String, Object> getInformationTypeById(String id) {
		GetRequest getRequest = new GetRequest(INDEX, TYPE, id);
		GetResponse getResponse = null;

		try {
			getResponse = restHighLevelClient.get(getRequest, requestOptions);
			if (getResponse.isSourceEmpty()) {
				logger.error(String.format("getInformationTypeById: Could not find a document to retrieve, document id=%s", id));
				throw new DocumentNotFoundException(String.format("Could not find a document to retrieve, document id=%s", id));
			}
		} catch (IOException ex) {
			logger.error(String.format("Error occurred during getInformationTypeById, document id=%s", id), ex);
			throw new DataCatalogBackendTechnicalException(ex.getLocalizedMessage(), ex);
		}
		return (getResponse != null) ? getResponse.getSourceAsMap() : null;
	}

	public void updateInformationTypeById(String id, Map<String, Object> jsonMap) {
		UpdateRequest updateRequest = new UpdateRequest(INDEX, TYPE, id);
		updateRequest.fetchSource(true);
		updateRequest.doc(jsonMap);

		try {
			restHighLevelClient.update(updateRequest, requestOptions);
		} catch (ElasticsearchException e) {
			if (e.status() == RestStatus.NOT_FOUND) {
				IndexRequest indexRequest = new IndexRequest(INDEX, TYPE, jsonMap.get("id").toString());
				indexRequest.source(jsonMap);
				try {
					restHighLevelClient.index(indexRequest, requestOptions);
				} catch (IOException ex) {
					logger.error(String.format("Error occurred during indexing, documentId=%s", jsonMap.get("id").toString()), ex);
					throw new DataCatalogBackendTechnicalException(ex.getLocalizedMessage(), ex);
				}
			} else {
				logger.error(String.format("Error occurred during updateInformationTypeById, document id=%s", id), e);
				throw new DataCatalogBackendTechnicalException(e.getLocalizedMessage(), e);
			}
		} catch (IOException ex) {
			logger.error(String.format("IOException occurred during updateInformationTypeById, document id=%s", id), ex);
			throw new DataCatalogBackendTechnicalException(ex.getLocalizedMessage(), ex);
		}
	}

	public void deleteInformationTypeById(String id) {
		DeleteRequest deleteRequest = new DeleteRequest(INDEX, TYPE, id);

		try {
			DeleteResponse deleteResponse = restHighLevelClient.delete(deleteRequest, requestOptions);
			if (deleteResponse.getResult() == DocWriteResponse.Result.NOT_FOUND) {
				throw new DocumentNotFoundException(String.format("Could not find a document to delete, document id=%s", id));
			}
		} catch (IOException ex) {
			ex.getLocalizedMessage();
		}
	}

	public SearchResponse searchByField(String fieldName, String fieldValue) {
		AbstractQueryBuilder query = new MatchQueryBuilder(fieldName, fieldValue);
		return searchByQuery(query);
	}

	public SearchResponse getAllRecords() {
		AbstractQueryBuilder query = new MatchAllQueryBuilder();
		return searchByQuery(query);
	}

	private SearchResponse searchByQuery(AbstractQueryBuilder query) {
		SearchRequest searchRequest = new SearchRequest();
		searchRequest.indices(INDEX);

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
