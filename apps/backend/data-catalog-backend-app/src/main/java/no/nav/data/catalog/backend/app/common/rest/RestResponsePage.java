package no.nav.data.catalog.backend.app.common.rest;

import lombok.Getter;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Getter
public class RestResponsePage<T> {

    private List<T> content;
    private int currentPage;
    private int pageSize;
    private long totalElements;

    public RestResponsePage(List<T> content, Pageable pageable, long total) {
        this.content = content;
        this.currentPage = pageable.getPageNumber();
        this.pageSize = pageable.getPageSize();
        this.totalElements = total;
    }

}