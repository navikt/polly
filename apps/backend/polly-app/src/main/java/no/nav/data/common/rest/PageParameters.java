package no.nav.data.common.rest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Slf4j
@Data
@AllArgsConstructor
@NoArgsConstructor
@ParameterObject
public class PageParameters {

    @Schema(defaultValue = "0", minimum = "0")
    private int pageNumber = 0;
    @Schema(defaultValue = "20", minimum = "1", maximum = "250")
    private int pageSize = 20;

    public Pageable createPage() {
        validate();
        return PageRequest.of(pageNumber, pageSize);
    }

    public Pageable createIdSortedPage() {
        validate();
        return PageRequest.of(pageNumber, pageSize, Sort.by("id"));
    }

    public Pageable createSortedPageByFieldDescending(String fieldName) {
        validate();
        return PageRequest.of(pageNumber, pageSize, Sort.by(fieldName).descending());
    }

    public void validate() {
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
