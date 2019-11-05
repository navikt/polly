package no.nav.data.polly.codelist;

import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;

public class CodelistStub {

    public static void initializeCodelist() {
        CodelistCache.init();
        CodelistCache.set(create(ListName.SOURCE, "ARBEIDSGIVER", "Arbeidsgiver"));
        CodelistCache.set(create(ListName.SOURCE, "SKATTEETATEN", "Skatteetaten"));
        CodelistCache.set(create(ListName.SOURCE, "BRUKER", "BRUKER"));
        CodelistCache.set(create(ListName.SOURCE, "Skatt", "Skatteetaten"));
        CodelistCache.set(create(ListName.CATEGORY, "Personalia", "Personalia"));
        CodelistCache.set(create(ListName.CATEGORY, "ARBEIDSFORHOLD", "Arbeidsforhold"));
        CodelistCache.set(create(ListName.CATEGORY, "UTDANNING", "Utdanning"));
        CodelistCache.set(create(ListName.PURPOSE, "Kontroll", "Kontrollering"));
        CodelistCache.set(create(ListName.PURPOSE, "AAP", "Arbeidsavklaringspenger"));
        CodelistCache.set(create(ListName.NATIONAL_LAW, "Samtykke", ""));
        CodelistCache.set(create(ListName.NATIONAL_LAW, "Ftrl", "1997-02-28-19"));
        CodelistCache.set(create(ListName.NATIONAL_LAW, "Ny alderspensjon", "2009-06-05-32"));
        CodelistCache.set(create(ListName.SENSITIVITY, "Særlige personopplysninger", "Særlige kategorier av personopplysninger"));
        CodelistCache.set(create(ListName.SENSITIVITY, "Personopplysning", "Personopplysning"));
        CodelistCache.set(create(ListName.SUBJECT_CATEGORY, "Bruker", "Bruker"));
        CodelistCache.set(create(ListName.GDPR_ARTICLE, "6a", "6a"));
        CodelistCache.set(create(ListName.GDPR_ARTICLE, "6e", "6e"));
        CodelistCache.set(create(ListName.GDPR_ARTICLE, "9a", "9a"));
    }

    private static Codelist create(ListName list, String code, String description) {
        return Codelist.builder().list(list).code(code).description(description).build();
    }
}
