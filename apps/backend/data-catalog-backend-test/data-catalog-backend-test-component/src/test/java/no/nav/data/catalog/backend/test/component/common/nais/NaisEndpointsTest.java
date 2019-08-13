package no.nav.data.catalog.backend.test.component.common.nais;

import io.micrometer.core.instrument.MeterRegistry;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.common.nais.NaisEndpoints;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(NaisEndpoints.class)
@ContextConfiguration(classes = AppStarter.class)
@ActiveProfiles("test")
public class NaisEndpointsTest {

    @MockBean
    private MeterRegistry meterRegistry;
    @Autowired
    private MockMvc mvc;

    @Test
    public void naisIsReady() throws Exception {
        String urlIsReady = "/internal/isReady";
        mvc.perform(get(urlIsReady))
                .andExpect(status().isOk());
    }

    @Test
    public void naisIsAlive() throws Exception {
        String urlIsAlive = "/internal/isAlive";
        mvc.perform(get(urlIsAlive))
                .andExpect(status().isOk());
    }
}