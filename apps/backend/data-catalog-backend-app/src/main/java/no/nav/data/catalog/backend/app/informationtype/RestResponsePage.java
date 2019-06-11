package no.nav.data.catalog.backend.app.informationtype;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties({"pageable", "last", "totalPages", "sort", "first", "numberOfElements", "empty"})
public class RestResponsePage<T> extends PageImpl<T> {

	@JsonProperty("content")
	private List<T> content;
	@JsonProperty("currentPage")
	private int number;
	@JsonProperty("pageSize")
	private int size;
	@JsonProperty("totalElements")
	private long totalElements;

	public RestResponsePage(List<T> content, Pageable pageable, long total) {
		super(content, pageable, total);
	}

	public RestResponsePage(List<T> content) {
		super(content);
	}

	public RestResponsePage() {
		super(new ArrayList<>());
	}
}