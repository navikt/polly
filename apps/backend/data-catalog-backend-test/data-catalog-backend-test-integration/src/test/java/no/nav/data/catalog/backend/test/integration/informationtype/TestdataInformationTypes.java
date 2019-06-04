package no.nav.data.catalog.backend.test.integration.informationtype;

import java.util.Map;

class TestdataInformationTypes {
	static final String CATEGORY_CODE = "PERSONALIA";
	static final String CATEGORY_DESCRIPTION = "Personalia";
	static final Map<String, String> CATEGORY_MAP = Map.of("code", CATEGORY_CODE, "description", CATEGORY_DESCRIPTION);
	static final String PRODUCER_CODE = "SKATTEETATEN";
	static final String PRODUCER_DESCRIPTION = "Skatteetaten";
	static final Map<String, String> PRODUCER_MAP = Map.of("code", PRODUCER_CODE, "description", PRODUCER_DESCRIPTION);
	static final String SYSTEM_CODE = "AA_REG";
	static final String SYSTEM_DESCRIPTION = "Arbeidsgiver / Arbeidstaker register";
	static final Map<String, String> SYSTEM_MAP = Map.of("code", SYSTEM_CODE, "description", SYSTEM_DESCRIPTION);
	static final String NAME = "InformationName";
	static final String DESCRIPTION = "InformationDescription";
	static final String URL = "/backend/informationtype";
}
