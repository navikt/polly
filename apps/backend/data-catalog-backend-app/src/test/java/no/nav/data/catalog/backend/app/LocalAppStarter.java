package no.nav.data.catalog.backend.app;


//@ActiveProfiles("local")
public class LocalAppStarter {
	public static void main(String[] args){
		System.setProperty("spring.profiles.active", "local");
//
//		try (InputStream inputStream = new FileInputStream(getFile(getenv("DATACATALOG_BACKEND_CONFIG") + "datacatalog-backend.properties"))) {
//			Properties properties = new Properties();
//			properties.load(inputStream);
//			properties.forEach((key, value) -> System.setProperty(key.toString(), value.toString()));
//		} catch (IOException e) {
//			throw new RuntimeException("Cannot find configuration on PATH");
//		}

		AppStarter.main(args);
	}
}
