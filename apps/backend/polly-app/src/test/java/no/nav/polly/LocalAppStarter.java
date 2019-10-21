package no.nav.polly;


import no.nav.polly.AppStarter;

public class LocalAppStarter {

    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "local");
        System.setProperty("ENVIRONMENT_CLASS", "preprod");
        AppStarter.main(args);
    }
}
