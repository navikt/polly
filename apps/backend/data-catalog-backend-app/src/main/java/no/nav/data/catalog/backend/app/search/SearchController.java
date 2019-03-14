package no.nav.data.catalog.backend.app.search;

import no.nav.data.catalog.backend.app.record.RecordService;
import org.elasticsearch.action.search.SearchResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/records/search")
public class SearchController {

	private RecordService recordService;

	public SearchController(RecordService recordService) {
		this.recordService = recordService;
	}

	@GetMapping(value = "/field/{fieldName}/{fieldValue}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public SearchResult searchByField(@PathVariable String fieldName, @PathVariable String fieldValue) {

		SearchResponse searchResponse = recordService.searchByField(fieldName, fieldValue);

		return SearchResult.builder()
				.searchResponse(searchResponse)
//				.page( + 1)
				.totalElements(searchResponse.getHits().getTotalHits())
//				.totalPages(searchResponse.getHits().getTotalHits() / (request.getPageSize() == 0 ? 15 : Math.min(request.getPageSize(), 100)))
				.results(searchResponse.getHits())
				.totalTimeInMillis(searchResponse.getTook().getMillis())
				.build();
	}
}
