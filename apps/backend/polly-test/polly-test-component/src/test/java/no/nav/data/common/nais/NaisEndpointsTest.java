package no.nav.data.common.nais;

import io.micrometer.core.instrument.MeterRegistry;
import no.nav.data.AppStarter;
import no.nav.data.polly.codelist.CodelistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(SpringExtension.class)
@WebMvcTest(NaisEndpoints.class)
@ContextConfiguration(classes = AppStarter.class)
@ActiveProfiles("test")
class NaisEndpointsTest {

    @MockBean
    private MeterRegistry meterRegistry;
    @MockBean
    private CodelistRepository codelistRepository;
    @Autowired
    private WebApplicationContext applicationContext;

    private MockMvc mvc;

    @BeforeEach
    void init() {
        mvc = MockMvcBuilders.webAppContextSetup(applicationContext).build();
    }

    @Test
    void naisIsReady() throws Exception {
        String urlIsReady = "/internal/isReady";
        mvc.perform(get(urlIsReady))
                .andExpect(status().isOk());
    }

    @Test
    void naisIsAlive() throws Exception {
        when(codelistRepository.count()).thenReturn(4L);
        String urlIsAlive = "/internal/isAlive";
        mvc.perform(get(urlIsAlive))
                .andExpect(status().isOk());
    }

    @Test
    void naisIsDead() throws Exception {
        when(codelistRepository.count()).thenThrow(new InvalidDataAccessApiUsageException("permission denied"));
        String urlIsAlive = "/internal/isAlive";
        mvc.perform(get(urlIsAlive))
                .andExpect(status().isInternalServerError());
    }
}