package no.nav.data.common.nais;

import io.micrometer.core.instrument.MeterRegistry;
import no.nav.data.polly.codelist.CodelistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NaisEndpointsTest {

    private final MeterRegistry meterRegistry = mock(MeterRegistry.class);
    private final CodelistRepository codelistRepository = mock(CodelistRepository.class);

    private MockMvc mvc;

    @BeforeEach
    void init() {
        mvc = MockMvcBuilders.standaloneSetup(new NaisEndpoints(meterRegistry, codelistRepository)).build();
    }

    @Test
    void naisIsReady() throws Exception {
        mvc.perform(get("/internal/isReady"))
                .andExpect(status().isOk());
    }

    @Test
    void naisIsAlive() throws Exception {
        when(codelistRepository.count()).thenReturn(4L);
        mvc.perform(get("/internal/isAlive"))
                .andExpect(status().isOk());
    }

    @Test
    void naisIsDead() throws Exception {
        when(codelistRepository.count()).thenThrow(new RuntimeException("permission denied"));
        mvc.perform(get("/internal/isAlive"))
                .andExpect(status().is5xxServerError());
    }
}