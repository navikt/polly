package no.nav.data.polly.purpose;

import no.nav.data.polly.AppStarter;
import no.nav.data.polly.policy.dto.LegalBasisResponse;
import no.nav.data.polly.process.ProcessService;
import no.nav.data.polly.process.dto.ProcessResponse;
import no.nav.data.polly.purpose.dto.InformationTypePurposeResponse;
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
@WebMvcTest(PurposeController.class)
@ContextConfiguration(classes = AppStarter.class)
@ActiveProfiles("test")
class PurposeControllerTest {

    @Autowired
    private MockMvc mvc;
    @MockBean
    private ProcessService processService;

    @Test
    void hentBehandlingsgrunnlag() throws Exception {
        InformationTypePurposeResponse informationType = new InformationTypePurposeResponse(UUID.fromString("ebd6296f-dbfb-4be3-82ea-16f2cc64f031"),
                "name", List.of(LegalBasisResponse.builder().gdpr("gdpr").nationalLaw("law").description("legaldesc").build()));
        given(processService.findForPurpose("the-purpose"))
                .willReturn(List.of(ProcessResponse.builder()
                        .id("0c4aedfe-5eaf-4dd3-8649-e5ac1fc14bdb")
                        .name("process a")
                        .purposeCode("the-purpose")
                        .informationType(informationType)
                        .build())
                );

        mvc.perform(get("/purpose/{purpose}", "the-purpose"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.purpose", is("the-purpose")))
                .andExpect(jsonPath("$.processes[0].id", is("0c4aedfe-5eaf-4dd3-8649-e5ac1fc14bdb")))
                .andExpect(jsonPath("$.processes[0].name", is("process a")))
                .andExpect(jsonPath("$.processes[0].informationTypes[0].id", is("ebd6296f-dbfb-4be3-82ea-16f2cc64f031")))
                .andExpect(jsonPath("$.processes[0].informationTypes[0].name", is("name")))
                .andExpect(jsonPath("$.processes[0].informationTypes[0].legalBases[0].gdpr", is("gdpr")))
                .andExpect(jsonPath("$.processes[0].informationTypes[0].legalBases[0].nationalLaw", is("law")))
                .andExpect(jsonPath("$.processes[0].informationTypes[0].legalBases[0].description", is("legaldesc")));
    }
}