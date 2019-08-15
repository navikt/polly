package no.nav.data.catalog.backend.app.search;

import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import org.elasticsearch.action.search.SearchResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("/records/search")
public class SearchController {

	@Autowired
	private ElasticsearchRepository repository;

	@GetMapping(value = "/field/{fieldName}/{fieldValue}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public SearchResult searchByField(@PathVariable String fieldName, @PathVariable String fieldValue) {

		SearchResponse searchResponse = repository.searchDatasetsByField(fieldName, fieldValue);

		return SearchResult.builder()
				.searchResponse(searchResponse)
				.totalElements(searchResponse.getHits().getTotalHits())
				.results(searchResponse.getHits())
				.totalTimeInMillis(searchResponse.getTook().getMillis())
				.build();
	}
}
