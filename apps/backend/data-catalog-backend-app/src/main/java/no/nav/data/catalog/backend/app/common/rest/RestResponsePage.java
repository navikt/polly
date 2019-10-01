package no.nav.data.catalog.backend.app.common.rest;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Getter
@NoArgsConstructor
@JsonPropertyOrder({"pageNumber", "pageSize", "returnedElements", "totalElements", "content"})
public class RestResponsePage<T> {

    private List<T> content;
    private int pageNumber;
    private int pageSize;
    private long returnedElements;
    private long totalElements;

    public RestResponsePage(List<T> content, Pageable pageable, long total) {
        this.content = content;
        this.pageNumber = pageable.getPageNumber();
        this.pageSize = pageable.getPageSize();
        this.returnedElements = content.size();
        this.totalElements = total;
    }

}