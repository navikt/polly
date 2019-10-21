package no.nav.data.polly.codelist;

public class CodelistStub {

    public static void initializeCodelist() {
        CodelistCache.init();
        CodelistCache.set(create(ListName.PROVENANCE, "ARBEIDSGIVER", "Arbeidsgiver"));
        CodelistCache.set(create(ListName.PROVENANCE, "SKATTEETATEN", "Skatteetaten"));
        CodelistCache.set(create(ListName.PROVENANCE, "BRUKER", "BRUKER"));
        CodelistCache.set(create(ListName.CATEGORY, "PERSONALIA", "Personalia"));
        CodelistCache.set(create(ListName.CATEGORY, "ARBEIDSFORHOLD", "Arbeidsforhold"));
        CodelistCache.set(create(ListName.CATEGORY, "UTDANNING", "Utdanning"));
    }

    private static Codelist create(ListName list, String code, String description) {
        return Codelist.builder().list(list).code(code).description(description).build();
    }
}
