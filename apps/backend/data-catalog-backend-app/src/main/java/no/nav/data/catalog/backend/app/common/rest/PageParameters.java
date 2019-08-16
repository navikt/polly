package no.nav.data.catalog.backend.app.common.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageParameters {

    private int pageNumber = 0;
    private int pageSize = 20;

    public Pageable createIdSortedPage() {
        return PageRequest.of(pageNumber, pageSize, Sort.by("id"));
    }
}
