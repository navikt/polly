package no.nav.data.catalog.backend.app;


public class LocalAppStarter {

    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "local");
        System.setProperty("ENVIRONMENT_CLASS", "preprod");
        System.setProperty("NAIS_NAMESPACE", "default");
        AppStarter.main(args);
    }
}
