package no.nav.data.polly.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.SearchHits;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResult {

	private int page;
	private Long totalPages;
	private Long totalElements;
	private Long totalTimeInMillis;
	private SearchHits results;
	private SearchResponse searchResponse;

}