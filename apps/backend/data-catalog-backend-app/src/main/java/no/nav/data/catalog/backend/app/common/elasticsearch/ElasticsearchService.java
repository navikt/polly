package no.nav.data.catalog.backend.app.common.elasticsearch;

import static no.nav.data.catalog.backend.app.common.utils.Constants.INDEX;
import static no.nav.data.catalog.backend.app.common.utils.Constants.TYPE;

import org.elasticsearch.ElasticsearchException;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class ElasticsearchService {

	private RestHighLevelClient restHighLevelClient;
	private RequestOptions requestOptions;

	public ElasticsearchService(RestHighLevelClient restHighLevelClient) {
		this.restHighLevelClient = restHighLevelClient;
		this.requestOptions = RequestOptions.DEFAULT.toBuilder().build();
	}

	// -------------- CRUD -----------------
	public void insertRecord(Map<String, Object> jsonMap) {
		IndexRequest indexRequest = new IndexRequest(INDEX, TYPE, jsonMap.get("id").toString());
		indexRequest.source(jsonMap);

		try {
			restHighLevelClient.index(indexRequest, requestOptions);
		} catch (ElasticsearchException e) {
			e.getDetailedMessage();
		} catch (IOException ex) {
			ex.getLocalizedMessage();
		}
	}

	public Map<String, Object> getRecordById(String id) {
		GetRequest getRequest = new GetRequest(INDEX, TYPE, id);
		GetResponse getResponse = null;

		try {
			getResponse = restHighLevelClient.get(getRequest, requestOptions);
		} catch (ElasticsearchException e) {
			e.getDetailedMessage();
		} catch (IOException ex) {
			ex.getLocalizedMessage();
		}
		return (getResponse != null) ? getResponse.getSourceAsMap() : null;
	}

	public void updateFieldsById(String id, Map<String, Object> jsonMap) {
		UpdateRequest updateRequest = new UpdateRequest(INDEX, TYPE, id);
		updateRequest.doc(jsonMap);

		try {
			restHighLevelClient.update(updateRequest, requestOptions);
		} catch (ElasticsearchException e) {
			e.getDetailedMessage();
		} catch (IOException ex) {
			ex.getLocalizedMessage();
		}
	}

	public void deleteRecordById(String id) {
		DeleteRequest deleteRequest = new DeleteRequest(INDEX, TYPE, id);

		try {
			restHighLevelClient.delete(deleteRequest, requestOptions);
		} catch (IOException ex) {
			ex.getLocalizedMessage();
		}
	}

	// ------------- SEARCH ----------------------
	public SearchResponse searchByField(String fieldName, String fieldValue) {
		SearchRequest searchRequest = new SearchRequest();
		searchRequest.indices(INDEX);

		SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
		searchSourceBuilder.query(new MatchQueryBuilder(fieldName, fieldValue));
		searchRequest.source(searchSourceBuilder);

		try {
			return restHighLevelClient.search(searchRequest, requestOptions);
		} catch (IOException ex) {
			ex.getLocalizedMessage();
		}
		return null;
	}
}
