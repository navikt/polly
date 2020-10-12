package no.nav.data.polly;


import no.nav.data.AppStarter;

public class LocalAppStarter {

    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "local");
        AppStarter.main(args);
    }
}
