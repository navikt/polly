package no.nav.data.polly;


import no.nav.data.AppStarter;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LocalAppStarter {

    public static void main(String[] args) {
        System.setProperty("spring.profiles.active", "local");
        AppStarter.main(args);
    }
}
