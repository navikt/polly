package no.nav.data.catalog.backend.app.dataset;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistStub;
import no.nav.data.catalog.backend.app.common.rest.PageParameters;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static no.nav.data.catalog.backend.app.dataset.DatasetMaster.REST;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(DatasetController.class)
@ContextConfiguration(classes = {AppStarter.class})
@ActiveProfiles("test")
public class DatasetControllerTest {

    private final ObjectMapper objectMapper = JsonUtils.getObjectMapper();

    @MockBean
    private DatasetRepository repository;
    @MockBean
    private DatasetService service;

    @Autowired
    private MockMvc mvc;

    @Before
    public void setUp() {
        CodelistStub.initializeCodelist();
    }

    private final Dataset dataset = Dataset.builder()
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
    public void findForId_withDescendants() throws Exception {
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
        Pageable pageable = new PageParameters().createIdSortedPage();
        Page<DatasetResponse> allRootDatasets = new PageImpl<>(Collections.singletonList(dataset.convertToResponse()), pageable, 1);

        when(service.findAllRootDatasets(false, pageable)).thenReturn(allRootDatasets);
        mvc.perform(get("/dataset/roots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(dataset.getId().toString()));
    }

    @Test
    public void countAllDatasets() throws Exception {
        when(repository.count()).thenReturn(4L);
        mvc.perform(get("/dataset/count"))
                .andExpect(status().isOk())
                .andExpect(content().string("4"));
    }

    @Test
    public void createDataset_shouldCreateADataset() throws Exception {
        List<DatasetRequest> requests = new ArrayList<>();
        requests.add(DatasetRequest.builder()
                .title("Title1")
                .description("Description")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(LocalDateTime.now().toString())
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistributionChannel"))
                .build());

        List<DatasetResponse> datasetResponses = requests.stream()
                .map(request -> new Dataset().convertNewFromRequest(request, REST))
                .map(Dataset::convertToResponse)
                .collect(Collectors.toList());

        when(service.save(ArgumentMatchers.anyList(), any(DatasetMaster.class))).thenReturn(datasetResponses);

        String inputJson = objectMapper.writeValueAsString(requests);

        mvc.perform(post("/dataset")
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.length()", is(1)));
    }

    @Test
    public void updateDataset_shouldUpdateDataset() throws Exception {
        List<DatasetRequest> requests = new ArrayList<>();
        requests.add(DatasetRequest.builder()
                .title("Title1")
                .description("UPDATED")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(LocalDateTime.now().toString())
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistributionChannel"))
                .build());

        List<DatasetResponse> datasetResponses = requests.stream()
                .map(request -> new Dataset().convertNewFromRequest(request, REST))
                .map(Dataset::convertToResponse)
                .collect(Collectors.toList());

        when(service.update(ArgumentMatchers.anyList())).thenReturn(datasetResponses);

        String inputJson = objectMapper.writeValueAsString(requests);

        mvc.perform(put("/dataset")
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andDo(print())
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.length()", is(1)))
                .andExpect(jsonPath("$[0].description", containsString("UPDATED")))
                .andReturn().getResponse();
    }

    @Test
    public void updateOneDatasetById() throws Exception {
        Dataset datasetToUpdate = Dataset.builder()
                .id(UUID.randomUUID())
                .datasetData(DatasetData.builder()
                        .title("UpdateTitle")
                        .description("Description")
                        .categories(List.of("Category"))
                        .provenances(List.of("Provenance"))
                        .pi(false)
                        .issued(LocalDateTime.now())
                        .keywords(List.of("Keywords"))
                        .theme("Theme")
                        .accessRights("AccessRights")
                        .publisher("Publisher")
                        .spatial("Spatial")
                        .haspart("Haspart")
                        .master(REST)
                        .build()
                ).build();

        DatasetRequest request = DatasetRequest.builder()
                .title("UpdateTitle")
                .description("UPDATED DESCRIPTION")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(LocalDateTime.now().toString())
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistributionChannel"))
                .build();

        Dataset datasetAfterUpdate = datasetToUpdate.convertUpdateFromRequest(request);

        when(repository.findById(datasetToUpdate.getId())).thenReturn(Optional.of(datasetToUpdate));
        when(repository.save(datasetAfterUpdate)).thenReturn(datasetAfterUpdate);

        String inputJson = objectMapper.writeValueAsString(request);

        mvc.perform(delete("/dataset/" + datasetToUpdate.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.description", is("UPDATED DESCRIPTION")));
    }

    @Test
    public void deleteDatasetById() throws Exception {
        Dataset deleteDataset = Dataset.builder()
                .id(UUID.randomUUID())
                .datasetData(DatasetData.builder()
                        .title("deleteTitle")
                        .description("Description")
                        .categories(List.of("Category"))
                        .provenances(List.of("Provenance"))
                        .pi(false)
                        .issued(LocalDateTime.now())
                        .keywords(List.of("Keywords"))
                        .theme("Theme")
                        .accessRights("AccessRights")
                        .publisher("Publisher")
                        .spatial("Spatial")
                        .haspart("Haspart")
                        .master(REST)
                        .build()
                ).build();

        when(repository.findById(deleteDataset.getId())).thenReturn(Optional.of(deleteDataset));
        when(repository.save(deleteDataset)).thenReturn(deleteDataset);

        mvc.perform(delete("/dataset/" + deleteDataset.getId()))
                .andExpect(status().isAccepted());
    }


}