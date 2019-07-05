package no.nav.data.catalog.backend.app.informationtype;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties({"pageable", "last", "totalPages", "sort", "first", "numberOfElements", "empty"})
@Getter
@EqualsAndHashCode(callSuper = false)
public class RestResponsePage<T extends Serializable> extends PageImpl<T> {

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
		this.content = content;
		this.number = pageable.getPageNumber();
		this.size = pageable.getPageSize();
		this.totalElements = total;
	}

	public RestResponsePage(List<T> content) {
		super(content);
	}

	public RestResponsePage() {
		super(new ArrayList<>());
	}
}