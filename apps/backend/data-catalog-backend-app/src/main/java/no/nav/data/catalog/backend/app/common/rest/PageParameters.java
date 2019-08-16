package no.nav.data.catalog.backend.app.common.rest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageParameters {

    private int pageNumber = 0;
    private int pageSize = 20;

}
