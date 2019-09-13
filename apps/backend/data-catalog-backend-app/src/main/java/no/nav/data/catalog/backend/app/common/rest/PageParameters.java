package no.nav.data.catalog.backend.app.common.rest;

import io.swagger.annotations.ApiParam;
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

    @ApiParam(defaultValue = "0")
    private int pageNumber = 0;
    @ApiParam(defaultValue = "20")
    private int pageSize = 20;

    public Pageable createIdSortedPage() {
        return PageRequest.of(pageNumber, pageSize, Sort.by("id"));
    }
}
