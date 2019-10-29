package no.nav.data.polly.common.rest;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Getter
@NoArgsConstructor
@JsonPropertyOrder({"pageNumber", "pageSize", "returnedElements", "totalElements", "content"})
public class RestResponsePage<T> {

    private List<T> content;
    private long pageNumber;
    private long pageSize;
    private long returnedElements;
    private long totalElements;

    public RestResponsePage(Page<T> page) {
        this(page.getContent(), page.getPageable(), page.getTotalElements());
    }

    public RestResponsePage(List<T> content) {
        this.content = content;
        this.pageNumber = 0L;
        this.pageSize = content.size();
        this.returnedElements = pageSize;
        this.totalElements = pageSize;
    }

    public RestResponsePage(List<T> content, Pageable pageable, long total) {
        this.content = content;
        this.pageNumber = pageable.getPageNumber();
        this.pageSize = pageable.getPageSize();
        this.returnedElements = content.size();
        this.totalElements = total;
    }

}