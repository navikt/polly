package no.nav.data.catalog.backend.app.common.rest;

import io.swagger.annotations.ApiParam;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Slf4j
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageParameters {

    @ApiParam(defaultValue = "0", allowableValues = "range[0, infinity]")
    private int pageNumber = 0;
    @ApiParam(defaultValue = "20", allowableValues = "range[1, 250]")
    private int pageSize = 20;

    public Pageable createIdSortedPage() {
        validate();
        return PageRequest.of(pageNumber, pageSize, Sort.by("id"));
    }

    private void validate() {
        if (pageNumber < 0) {
            log.warn("invalid pageNumber {}, setting to 0", pageNumber);
            pageNumber = 0;
        }
        if (pageSize < 1) {
            log.warn("invalid pageSize {}, setting to 1", pageSize);
            pageSize = 1;
        }
        if (pageSize > 250) {
            log.warn("invalid pageSize {}, setting to 250", pageSize);
            pageSize = 250;
        }
    }
}
