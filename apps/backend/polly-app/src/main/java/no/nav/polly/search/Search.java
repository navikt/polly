package no.nav.polly.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Search {

	private int page;
	private int pageSize;
	private String index;
	private String indexType;

}