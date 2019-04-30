package no.nav.data.catalog.backend.app.common.utils;

public final class Constants {

	private Constants() {
		throw new IllegalStateException("Utility class");
	}

	public static final String INDEX = "informationtypes";
	public static final String TYPE = "_doc";

	public static final String INFORMATION_CATEGORY = "PERSONALIA";
	public static final String INFORMATION_PRODUCER = "SKATTEETATEN";
	public static final String INFORMATION_SYSTEM = "AA_REG";
	public static final String INFORMATION_NAME = "InformationName";
	public static final String INFORMATION_DESCRIPTION = "InformationDescription";

	public static final long SERIAL_VERSION_UID = 1L;
}
