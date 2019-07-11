package no.nav.data.catalog.backend.test.integration.informationtype;

import java.util.List;
import java.util.Map;

class TestdataInformationTypes {
	static final String CATEGORY_CODE = "PERSONALIA";
	static final String CATEGORY_DESCRIPTION = "Personalia";
	static final Map<String, String> CATEGORY_MAP = Map.of("code", CATEGORY_CODE, "description", CATEGORY_DESCRIPTION);
	static final String PRODUCER_CODE_STRING = "SKATTEETATEN, BRUKER";
	static final List<String> PRODUCER_CODE_LIST = List.of("SKATTEETATEN", "BRUKER");
	static final List<String> PRODUCER_DESCRIPTION_LIST = List.of("Skatteetaten", "Bruker");
	static final List<Map> LIST_PRODUCER_MAP = List.of(
			Map.of("code", PRODUCER_CODE_LIST.get(0), "description", PRODUCER_DESCRIPTION_LIST.get(0)),
			Map.of("code", PRODUCER_CODE_LIST.get(1), "description", PRODUCER_DESCRIPTION_LIST.get(1)));
	static final String SYSTEM_CODE = "AA-REG";
	static final String SYSTEM_DESCRIPTION = "Arbeidsgiver / Arbeidstaker register";
	static final Map<String, String> SYSTEM_MAP = Map.of("code", SYSTEM_CODE, "description", SYSTEM_DESCRIPTION);
	static final String NAME = "InformationName";
	static final String DESCRIPTION = "InformationDescription";
	static final String URL = "/informationtype";
}
