package no.nav.data.catalog.backend.app.codelist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CodelistRequest {

	private ListName list;
	private String code;
	private String description;

	public Codelist convert() {
		return Codelist.builder()
				.list(list)
				.code(code.toUpperCase())
				.description(description)
				.build();
	}

	void toUpperCaseAndTrim() {
		setCode(this.code.toUpperCase().trim());
		setDescription(this.description.trim());
	}

}
