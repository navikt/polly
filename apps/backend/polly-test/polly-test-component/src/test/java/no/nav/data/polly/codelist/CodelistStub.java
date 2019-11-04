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
        CodelistCache.set(create(ListName.SENSITIVITY, "Særskilte personopplysninger", "Særskilte personopplysninger"));
        CodelistCache.set(create(ListName.SENSITIVITY, "Personopplysning", "Personopplysning"));
        CodelistCache.set(create(ListName.SUBJECT_CATEGORY, "Bruker", "Bruker"));
    }

    private static Codelist create(ListName list, String code, String description) {
        return Codelist.builder().list(list).code(code).description(description).build();
    }
}
