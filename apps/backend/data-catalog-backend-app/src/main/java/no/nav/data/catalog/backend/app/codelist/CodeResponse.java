package no.nav.data.catalog.backend.app.codelist;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CodeResponse {

    private String code;
    private String description;
}
