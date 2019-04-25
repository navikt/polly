package no.nav.data.catalog.backend.app;


import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("local")
@Import(AppStarter.class)
public class LocalAppStarter {

	public static void main(String[] args) {
		System.setProperty("spring.profiles.active", "local");
		AppStarter.main(args);
	}
}
