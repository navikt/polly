package no.nav.data.polly.search;

import no.nav.data.polly.elasticsearch.ElasticsearchProperties;
import no.nav.data.polly.elasticsearch.domain.ElasticsearchRepository;
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
	@Autowired
	private ElasticsearchProperties properties;

	@GetMapping(value = "/field/{fieldName}/{fieldValue}", produces = MediaType.APPLICATION_JSON_VALUE)
	public SearchResult searchByField(@PathVariable String fieldName, @PathVariable String fieldValue) {

		SearchResponse searchResponse = repository.searchInformationTypesByField(fieldName, fieldValue, properties.getIndex());

		return SearchResult.builder()
				.searchResponse(searchResponse)
				.totalElements(searchResponse.getHits().getTotalHits())
				.results(searchResponse.getHits())
				.totalTimeInMillis(searchResponse.getTook().getMillis())
				.build();
	}
}
