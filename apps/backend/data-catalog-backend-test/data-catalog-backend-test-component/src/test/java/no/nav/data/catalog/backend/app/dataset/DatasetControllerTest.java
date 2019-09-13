package no.nav.data.catalog.backend.app.dataset;

import com.fasterxml.jackson.databind.ObjectMapper;
import no.nav.data.catalog.backend.app.AppStarter;
import no.nav.data.catalog.backend.app.codelist.CodelistStub;
import no.nav.data.catalog.backend.app.common.rest.PageParameters;
import no.nav.data.catalog.backend.app.common.utils.JsonUtils;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelShort;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelType;
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

import static junit.framework.TestCase.assertTrue;
import static no.nav.data.catalog.backend.app.dataset.DatacatalogMaster.REST;
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
                .andExpect(jsonPath("$.title").value(dataset.getTitle()));
    }

    @Test
    public void findForId_withDescendants() throws Exception {
        when(service.findDatasetWithAllDescendants(dataset.getId())).thenReturn(dataset.convertToResponse());
        mvc.perform(get("/dataset/{id}", dataset.getId()).param("includeDescendants", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(dataset.getTitle()));
    }

    @Test
    public void getDatasetByTitle() throws Exception {
        when(repository.findByTitle(dataset.getDatasetData().getTitle())).thenReturn(Optional.of(dataset));
        mvc.perform(get("/dataset/title/{title}", dataset.getDatasetData().getTitle()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(dataset.getTitle()));
    }

    @Test
    public void findAllRoot() throws Exception {
        Pageable pageable = new PageParameters().createIdSortedPage();
        Page<DatasetResponse> allRootDatasets = new PageImpl<>(Collections.singletonList(dataset.convertToResponse()), pageable, 1);

        when(service.findAllRootDatasets(false, pageable)).thenReturn(allRootDatasets);
        mvc.perform(get("/dataset/roots"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value(dataset.getTitle()));
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
        DatasetRequest request = createValidDatasetRequest("Title1");
        List<DatasetRequest> requests = new ArrayList<>(List.of(request));

        when(service.saveAll(ArgumentMatchers.anyList(), any(DatacatalogMaster.class))).thenReturn(Collections.singletonList(new Dataset()));

        String inputJson = objectMapper.writeValueAsString(requests);

        mvc.perform(post("/dataset")
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.length()", is(1)));
    }

    @Test
    public void updateDataset_shouldUpdateDataset() throws Exception {
        DatasetRequest request = createValidDatasetRequest("Title1");

        List<DatasetRequest> requests = new ArrayList<>(List.of(request));

        when(service.updateAll(ArgumentMatchers.anyList()))
                .thenReturn(Collections.singletonList(Dataset.builder().datasetData(DatasetData.builder().description("UPDATED").build()).build()));

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
    public void updateOneDatasetById_withExistingIdAndRequestIsNull() throws Exception {
        Dataset datasetToUpdate = Dataset.builder()
                .id(UUID.randomUUID())
                .datasetData(createValidDatasetData("UpdateTitle")).build();

        DatasetRequest request = null;

        when(repository.findById(datasetToUpdate.getId())).thenReturn(Optional.of(datasetToUpdate));
        String inputJson = objectMapper.writeValueAsString(request);

        Exception exception = mvc.perform(put("/dataset/" + datasetToUpdate.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8_VALUE)
                .content(inputJson))
                .andExpect(status().isBadRequest()).andReturn().getResolvedException();

        assertTrue(exception.getLocalizedMessage().contains("Required request body is missing:"));

    }

    @Test
    public void updateOneDatasetById() throws Exception {
        Dataset datasetToUpdate = Dataset.builder()
                .id(UUID.randomUUID())
                .datasetData(createValidDatasetData("UpdateTitle")).build();

        DatasetRequest request = createValidDatasetRequest("UpdateTitle");

        Dataset datasetAfterUpdate = datasetToUpdate.convertUpdateFromRequest(request);

        when(repository.findById(datasetToUpdate.getId())).thenReturn(Optional.of(datasetToUpdate));
        when(service.delete(any(DatasetRequest.class))).thenReturn(datasetAfterUpdate);

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
                .datasetData(createValidDatasetData("deleteTitle")).build();

        when(repository.findById(deleteDataset.getId())).thenReturn(Optional.of(deleteDataset));
        when(service.delete(any(DatasetRequest.class))).thenReturn(deleteDataset);

        mvc.perform(delete("/dataset/" + deleteDataset.getId()))
                .andExpect(status().isAccepted());
    }


    private DatasetRequest createValidDatasetRequest(String title) {
        return DatasetRequest.builder()
                .contentType(ContentType.DATASET.name())
                .title(title)
                .description("UPDATED DESCRIPTION")
                .categories(List.of("Category"))
                .provenances(List.of("ARBEIDSGIVER"))
                .pi("false")
                .issued(LocalDateTime.now().toString())
                .keywords(List.of("Keywords"))
                .themes(Collections.singletonList("Theme"))
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of(new DistributionChannelShort("DistributionChannel", DistributionChannelType.KAFKA.name())))
                .build();
    }

    private DatasetData createValidDatasetData(String title) {
        return DatasetData.builder()
                .contentType(ContentType.DATASET)
                .title(title)
                .description("Description")
                .categories(List.of("Category"))
                .provenances(List.of("ARBEIDSGIVER"))
                .pi(false)
                .issued(LocalDateTime.now())
                .keywords(List.of("Keywords"))
                .themes(Collections.singletonList("Theme"))
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .datacatalogMaster(REST)
                .build();
    }
}