package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.dataset.Dataset;
import no.nav.data.catalog.backend.app.dataset.DatasetController;
import no.nav.data.catalog.backend.app.dataset.DatasetData;
import no.nav.data.catalog.backend.app.dataset.DatasetService;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(DatasetController.class)
@ContextConfiguration(classes = {AppStarter.class})
@ActiveProfiles("test")
public class DatasetControllerTest {

    @MockBean
    private DatasetRepository repository;
    @MockBean
    private DatasetService service;

    @Autowired
    private MockMvc mvc;

    private Dataset dataset = Dataset.builder()
            .id(UUID.randomUUID())
            .datasetData(DatasetData.builder()
                    .title("datasetTitle")
                    .build()
            ).build();

    @Test
    public void findForId() throws Exception {
        when(repository.findById(dataset.getId())).thenReturn(Optional.of(dataset));
        mvc.perform(get("/dataset/{id}", dataset.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(dataset.getId().toString()))
                .andExpect(jsonPath("$.title").value("datasetTitle"));
    }

    @Test
    public void findForIdWithDescendants() throws Exception {
        when(service.findDatasetWithAllDescendants(dataset.getId())).thenReturn(dataset.convertToResponse());
        mvc.perform(get("/dataset/{id}", dataset.getId()).param("includeDescendants", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(dataset.getId().toString()));
    }

    @Test
    public void getDatasetByTitle() throws Exception {
        when(repository.findByTitle(dataset.getDatasetData().getTitle())).thenReturn(Optional.of(dataset));
        mvc.perform(get("/dataset/title/{title}", dataset.getDatasetData().getTitle()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(dataset.getId().toString()));
    }

    @Test
    public void findAllRoot() throws Exception {
        when(service.findAllRootDatasets(false, PageRequest.of(0, 20, Sort.by("id")))).thenReturn(new PageImpl<>(Collections.singletonList(dataset.convertToResponse())));
        mvc.perform(get("/dataset/roots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(dataset.getId().toString()));
    }

    @Test
    public void count() throws Exception {
        when(repository.count()).thenReturn(4L);
        mvc.perform(get("/dataset/count"))
                .andExpect(status().isOk())
                .andExpect(content().string("4"));
    }
}