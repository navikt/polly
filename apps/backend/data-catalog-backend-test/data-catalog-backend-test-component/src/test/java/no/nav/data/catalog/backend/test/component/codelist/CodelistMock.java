package no.nav.data.catalog.backend.test.component.codelist;

import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.codelist.CodelistService;
import no.nav.data.catalog.backend.app.codelist.ListName;

import static org.mockito.Mockito.mock;

public class CodelistMock {

    public static void initializeCodelist() {
        new CodelistService(mock(CodelistRepository.class));
        CodelistService.codelists.get(ListName.PRODUCER).put("ARBEIDSGIVER", "Arbeidsgiver");
        CodelistService.codelists.get(ListName.PRODUCER).put("SKATTEETATEN", "Skatteetaten");
        CodelistService.codelists.get(ListName.PRODUCER).put("BRUKER", "Bruker");
        CodelistService.codelists.get(ListName.CATEGORY).put("PERSONALIA", "Personalia");
        CodelistService.codelists.get(ListName.CATEGORY).put("ARBEIDSFORHOLD", "Arbeidsforhold");
        CodelistService.codelists.get(ListName.CATEGORY).put("UTDANNING", "Utdanning");
        CodelistService.codelists.get(ListName.SYSTEM).put("TPS", "Tjenestebasert PersondataSystem");
    }
}
