package no.nav.data.polly.behandlingsgrunnlag;

import no.nav.data.polly.AppStarter;
import no.nav.data.polly.behandlingsgrunnlag.domain.InformationTypeBehandlingsgrunnlagResponse;
import no.nav.data.polly.legalbasis.LegalBasisResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.hamcrest.core.Is.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(BehandlingsgrunnlagController.class)
@ContextConfiguration(classes = AppStarter.class)
@ActiveProfiles("test")
class BehandlingsgrunnlagControllerTest {

    @Autowired
    private MockMvc mvc;
    @MockBean
    private BehandlingsgrunnlagService behandlingsgrunnlagService;

    @Test
    void hentBehandlingsgrunnlag() throws Exception {
        given(behandlingsgrunnlagService.findBehandlingForPurpose("the-purpose"))
                .willReturn(List.of(new InformationTypeBehandlingsgrunnlagResponse(UUID.fromString("ebd6296f-dbfb-4be3-82ea-16f2cc64f031"),
                        "name", List.of(LegalBasisResponse.builder().gdpr("gdpr").nationalLaw("law").description("legaldesc").build()))
                ));

        mvc.perform(get("/behandlingsgrunnlag/purpose/{purpose}", "the-purpose"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.purpose", is("the-purpose")))
                .andExpect(jsonPath("$.informationTypes[0].id", is("ebd6296f-dbfb-4be3-82ea-16f2cc64f031")))
                .andExpect(jsonPath("$.informationTypes[0].name", is("name")))
                .andExpect(jsonPath("$.informationTypes[0].legalBases[0].gdpr", is("gdpr")))
                .andExpect(jsonPath("$.informationTypes[0].legalBases[0].nationalLaw", is("law")))
                .andExpect(jsonPath("$.informationTypes[0].legalBases[0].description", is("legaldesc")));
    }
}