package no.nav.data.common.nais;

import no.nav.data.AppStarter;
import no.nav.data.common.test.MockRepositoriesConfig;
import no.nav.data.polly.codelist.CodelistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.context.annotation.Import;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = WebEnvironment.MOCK, classes = AppStarter.class)
@Import(MockRepositoriesConfig.class)
@ActiveProfiles({"test", "test-component"})
class NaisEndpointsTest {

    @MockitoBean
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
        when(codelistRepository.count()).thenThrow(new InvalidDataAccessApiUsageException("permission denied"));
        mvc.perform(get("/internal/isAlive"))
                .andExpect(status().isInternalServerError());
    }
}