package no.nav.data.catalog.backend.app.codelist;

import java.util.Map;

public class CodelistStub {

    public static void initializeCodelist() {
        CodelistService.initListNames();
        Map<ListName, Map<String, String>> codelists = CodelistService.codelists;
        codelists.get(ListName.PROVENANCE).put("ARBEIDSGIVER", "Arbeidsgiver");
        codelists.get(ListName.PROVENANCE).put("SKATTEETATEN", "Skatteetaten");
        codelists.get(ListName.PROVENANCE).put("BRUKER", "Bruker");
        codelists.get(ListName.CATEGORY).put("PERSONALIA", "Personalia");
        codelists.get(ListName.CATEGORY).put("ARBEIDSFORHOLD", "Arbeidsforhold");
        codelists.get(ListName.CATEGORY).put("UTDANNING", "Utdanning");
    }
}
