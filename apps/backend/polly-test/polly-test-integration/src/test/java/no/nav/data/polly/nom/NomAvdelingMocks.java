package no.nav.data.polly.nom;

import no.nav.data.integration.nom.domain.OrgEnhet;
import no.nav.data.integration.nom.domain.Organisering;
import no.nav.data.integration.nom.dto.OrgEnhetGraphqlResponse;

import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static no.nav.data.common.utils.JsonUtils.toJson;

public class NomAvdelingMocks {
    public static void mock() {
        stubFor(post("/nom/graphql").willReturn(okJson(toJson(nomAvdelingMockResponse()))));
    }

    private static OrgEnhetGraphqlResponse nomAvdelingMockResponse() {
        List<Organisering> nomAvdelinger = List.of(
                Organisering.builder().orgEnhet(OrgEnhet.builder().id("DEP").navn("dep").build()).build(),
                Organisering.builder().orgEnhet(OrgEnhet.builder().id("AOT").navn("Arbeids- og tjenesteavdelingen").build()).build()
        );

        var response = new OrgEnhetGraphqlResponse();
        response.setData(OrgEnhetGraphqlResponse.DataWrapper.builder().orgEnhet(OrgEnhet.builder().id("test").organiseringer(nomAvdelinger).build()).build());
        return response;
    }
}
