package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;

public class CodelistStub {

    public static void initializeCodelist() {
        CodelistCache.init();
        add(ListName.SOURCE, "ARBEIDSGIVER", "Arbeidsgiver");
        add(ListName.SOURCE, "SKATTEETATEN", "Skatteetaten");
        add(ListName.SOURCE, "BRUKER", "BRUKER");
        add(ListName.SOURCE, "Skatt", "Skatteetaten");
        add(ListName.CATEGORY, "Personalia", "Personalia");
        add(ListName.CATEGORY, "ARBEIDSFORHOLD", "Arbeidsforhold");
        add(ListName.CATEGORY, "UTDANNING", "Utdanning");
        add(ListName.PURPOSE, "Kontroll", "Kontrollering");
        add(ListName.PURPOSE, "AAP", "Arbeidsavklaringspenger");
        add(ListName.NATIONAL_LAW, "Samtykke", "");
        add(ListName.NATIONAL_LAW, "Ftrl", "1997-02-28-19");
        add(ListName.NATIONAL_LAW, "Ny alderspensjon", "2009-06-05-32");
        add(ListName.SENSITIVITY, "Særlige personopplysninger", "Særlige kategorier av personopplysninger");
        add(ListName.SENSITIVITY, "Personopplysning", "Personopplysning");
        add(ListName.SUBJECT_CATEGORY, "Bruker", "Bruker");
        add(ListName.GDPR_ARTICLE, "6a", "6a");
        add(ListName.GDPR_ARTICLE, "6e", "6e");
        add(ListName.GDPR_ARTICLE, "9a", "9a");
        add(ListName.DEPARTMENT, "dep", "mdep");
        add(ListName.SUB_DEPARTMENT, "subdep", "sdep");
        add(ListName.SYSTEM, "TPS", "Tjenestebasert PersondataSystem");
        add(ListName.SYSTEM, "PESYS", "Pensjonssystem");
        add(ListName.SYSTEM, "AA-REG", "Arbeidsgiver / Arbeidstaker register");
    }

    private static void add(ListName source, String arbeidsgiver, String arbeidsgiver2) {
        CodelistCache.set(create(source, arbeidsgiver, arbeidsgiver2));
    }

    private static Codelist create(ListName list, String code, String description) {
        return Codelist.builder().list(list).code(code).description(description).build();
    }
}
