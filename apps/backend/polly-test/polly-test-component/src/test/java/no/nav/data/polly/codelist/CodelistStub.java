package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;

public class CodelistStub {

    public static void initializeCodelist() {
        CodelistCache.init();
        add(ListName.THIRD_PARTY, "ARBEIDSGIVER", "ARBEIDSGIVER", "Arbeidsgiver");
        add(ListName.THIRD_PARTY, "SKATTEETATEN", "SKATTEETATEN", "Skatteetaten");
        add(ListName.THIRD_PARTY, "BRUKER", "BRUKER", "BRUKER");
        add(ListName.THIRD_PARTY, "SKATT", "Skatt", "Skatteetaten");
        add(ListName.CATEGORY, "PERSONALIA", "Personalia", "Personalia");
        add(ListName.CATEGORY, "ARBEIDSFORHOLD", "ARBEIDSFORHOLD", "Arbeidsforhold");
        add(ListName.CATEGORY, "UTDANNING", "UTDANNING", "Utdanning");
        add(ListName.PURPOSE, "KONTROLL", "Kontroll", "Kontrollering");
        add(ListName.PURPOSE, "AAP", "AAP", "Arbeidsavklaringspenger");
        add(ListName.NATIONAL_LAW, "SAMTYKKE", "Samtykke", "");
        add(ListName.NATIONAL_LAW, "FTRL", "Ftrl", "1997-02-28-19");
        add(ListName.NATIONAL_LAW, "NY_ALDERSPENSJON", "Ny alderspensjon", "2009-06-05-32");
        add(ListName.SENSITIVITY, "SAERLIGE_PERSONOPPLYSNINGER", "Særlige personopplysninger", "Særlige kategorier av personopplysninger");
        add(ListName.SENSITIVITY, "PERSONOPPLYSNING", "Personopplysning", "Personopplysning");
        add(ListName.SUBJECT_CATEGORY, "BRUKER", "Bruker", "Bruker");
        add(ListName.GDPR_ARTICLE, "ART61A", "6a", "6a");
        add(ListName.GDPR_ARTICLE, "6E", "6e", "6e");
        add(ListName.GDPR_ARTICLE, "9A", "9a", "9a");
        add(ListName.DEPARTMENT, "DEP", "dep", "mdep");
        add(ListName.SUB_DEPARTMENT, "SUBDEP", "subdep", "sdep");
        add(ListName.SYSTEM, "TPS", "TPS", "Tjenestebasert PersondataSystem");
        add(ListName.SYSTEM, "PESYS", "PESYS", "Pensjonssystem");
        add(ListName.SYSTEM, "AA_REG", "AA-REG", "Arbeidsgiver / Arbeidstaker register");
    }

    private static void add(ListName source, String code, String name, String desc) {
        CodelistCache.set(create(source, code, name, desc));
    }

    private static Codelist create(ListName list, String code, String name, String description) {
        return Codelist.builder().list(list).code(code).shortName(name).description(description).build();
    }
}
