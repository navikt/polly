package no.nav.data.common.rest;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
@NoArgsConstructor
@JsonPropertyOrder({"pageNumber", "pageSize", "pages", "numberOfElements", "totalElements", "content"})
public class RestResponsePage<T> {

    private long pageNumber;
    private long pageSize;
    private long pages;
    private long numberOfElements;
    private long totalElements;
    private List<T> content;

    public RestResponsePage(Page<T> page) {
        this.content = page.getContent();
        this.pageNumber = page.getNumber();
        this.pageSize = page.getSize();
        this.pages = page.getTotalPages();
        this.numberOfElements = page.getNumberOfElements();
        this.totalElements = page.getTotalElements();
    }

    public RestResponsePage(List<T> content) {
        this.content = content;
        this.pageNumber = 0L;
        this.pages = 1L;
        this.pageSize = content.size();
        this.numberOfElements = content.size();
        this.totalElements = content.size();
    }

}