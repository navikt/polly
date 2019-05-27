package no.nav.data.catalog.backend.test.integration.codelist;

import no.nav.data.catalog.backend.app.codelist.CodelistRequest;
import no.nav.data.catalog.backend.app.codelist.ListName;

abstract class TestdataCodelists {

	static final ListName LIST = ListName.PRODUCER;
	static final String CODE = "TEST_CODE";
	static final String DESCRIPTION = "Test description";
	static final String URL = "/backend/codelist";

	CodelistRequest createRequest(ListName listName, String code, String description) {
		return CodelistRequest.builder()
				.list(listName)
				.code(code)
				.description(description)
				.build();
	}

	CodelistRequest createRequest() {
		return createRequest(LIST, CODE, DESCRIPTION);
	}
}
