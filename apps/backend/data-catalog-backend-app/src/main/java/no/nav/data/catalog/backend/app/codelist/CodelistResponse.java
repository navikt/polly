package no.nav.data.catalog.backend.app.codelist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CodelistResponse {
	private String code;
	private String description;
}
