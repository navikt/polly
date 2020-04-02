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
        add(ListName.PURPOSE, "AAP", "Arbeidsavklaringspenger", "Behandle og vurdere rett til arbeidsavklaringspenger som har til formål å sikre inntekt mens bruker får bistand fra NAV til å komme i arbeid.");
        add(ListName.NATIONAL_LAW, "SAMTYKKE", "Samtykke", "");
        add(ListName.NATIONAL_LAW, "FTRL", "Folketrygdloven", "1997-02-28-19");
        add(ListName.NATIONAL_LAW, "NY_ALDERSPENSJON", "Ny alderspensjon", "2009-06-05-32");
        add(ListName.SENSITIVITY, "SAERLIGE_PERSONOPPLYSNINGER", "Særlige personopplysninger", "Særlige kategorier av personopplysninger");
        add(ListName.SENSITIVITY, "PERSONOPPLYSNING", "Personopplysning", "Personopplysning");
        add(ListName.SUBJECT_CATEGORY, "BRUKER", "Bruker", "Bruker");
        add(ListName.SUBJECT_CATEGORY, "ANDRE", "Andre", "Bruker");
        add(ListName.SUBJECT_CATEGORY, "PARTNER", "Partner", "Bruker");
        add(ListName.GDPR_ARTICLE, "ART61A", "Art. 6(1)a - Samtykke", "6a");
        add(ListName.GDPR_ARTICLE, "ART61C", "Art. 6(1)c - Rettslig forpliktelse", "6a");
        add(ListName.GDPR_ARTICLE, "6E", "6e", "6e");
        add(ListName.GDPR_ARTICLE, "9A", "9a", "9a");
        add(ListName.DEPARTMENT, "DEP", "dep", "mdep");
        add(ListName.DEPARTMENT, "AOT", "Arbeids- og tjenesteavdelingen", "mdep");
        add(ListName.SUB_DEPARTMENT, "SUBDEP", "subdep", "sdep");
        add(ListName.SUB_DEPARTMENT, "PEN", "NAV Familie- og pensjonsytelser", "sdep");
        add(ListName.SYSTEM, "TPS", "TPS", "Tjenestebasert PersondataSystem");
        add(ListName.SYSTEM, "PESYS", "Pesys", "Pensjonssystem");
        add(ListName.SYSTEM, "AA_REG", "AA-REG", "Arbeidsgiver / Arbeidstaker register");
    }

    private static void add(ListName source, String code, String name, String desc) {
        CodelistCache.set(create(source, code, name, desc));
    }

    private static Codelist create(ListName list, String code, String name, String description) {
        return Codelist.builder().list(list).code(code).shortName(name).description(description).build();
    }
}
