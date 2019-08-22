package no.nav.data.catalog.backend.app.codelist;

import java.util.Map;

public class CodelistStub {

    public static void initializeCodelist() {
        Map<ListName, Map<String, String>> codelists = CodelistService.codelists;
        codelists.get(ListName.PRODUCER).put("ARBEIDSGIVER", "Arbeidsgiver");
        codelists.get(ListName.PRODUCER).put("SKATTEETATEN", "Skatteetaten");
        codelists.get(ListName.PRODUCER).put("BRUKER", "Bruker");
        codelists.get(ListName.CATEGORY).put("PERSONALIA", "Personalia");
        codelists.get(ListName.CATEGORY).put("ARBEIDSFORHOLD", "Arbeidsforhold");
        codelists.get(ListName.CATEGORY).put("UTDANNING", "Utdanning");
        codelists.get(ListName.SYSTEM).put("TPS", "Tjenestebasert PersondataSystem");
        codelists.get(ListName.SYSTEM).put("PESYS", "Pensjon");
    }
}
