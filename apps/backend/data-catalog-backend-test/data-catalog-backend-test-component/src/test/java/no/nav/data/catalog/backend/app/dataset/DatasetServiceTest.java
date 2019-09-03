package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.codelist.CodelistStub;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.dataset.DatasetMaster.GITHUB;
import static no.nav.data.catalog.backend.app.dataset.DatasetMaster.REST;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class DatasetServiceTest {
    @Mock
    private DatasetRepository datasetRepository;

    @InjectMocks
    private DatasetService service;

    @Before
    public void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    public void save_shouldSave_whenRequestIsValid() {
        DatasetRequest request = DatasetRequest.builder()
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
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build();

        service.save(List.of(request), REST);
        verify(datasetRepository, times(1)).saveAll(anyList());
    }

    @Test
    public void update_shouldUpdate_whenRequestIsValid() {
        DatasetRequest request = DatasetRequest.builder()
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
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build();

        service.update(List.of(request));
        verify(datasetRepository, times(1)).saveAll(anyList());
    }

    @Test
    public void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsNull() {
        service.validateRequest(null, false, REST);
    }

    @Test
    public void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<DatasetRequest> requests = Collections.emptyList();
        service.validateRequest(requests, false, REST);
    }

    @Test
    public void validateRequest_shouldThrowValidationException_withDuplicatedElementInRequest() {
        List<DatasetRequest> requests = new ArrayList<>();
        String localDateTime = LocalDateTime.now().toString();

        requests.add(DatasetRequest.builder()
                .title("Title1")
                .description("Description")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(localDateTime)
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());
        requests.add(DatasetRequest.builder()
                .title("Title2")
                .description("Description")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(localDateTime)
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());
        requests.add(DatasetRequest.builder()
                .title("Title1")
                .description("Description")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(localDateTime)
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());
        try {
            service.validateRequest(requests, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Request:3 -- DuplicateElement -- The dataset Title1 is not unique because it has already been used in this request (see request:1)"));
        }
    }

    @Test
    public void validateRequest_shouldThrowValidationException_withDuplicatedIdentifyingFieldsInRequest() {
        List<DatasetRequest> requests = new ArrayList<>();
        String localDateTime = LocalDateTime.now().toString();

        requests.add(DatasetRequest.builder()
                .title("Title1")
                .description("Description")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(localDateTime)
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());
        requests.add(DatasetRequest.builder()
                .title("Title2")
                .description("Description")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(localDateTime)
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());
        requests.add(DatasetRequest.builder()
                .title("Title1")
                .description("Not equal object as the request1")
                .categories(List.of("Category"))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(localDateTime)
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());
        try {
            service.validateRequest(requests, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Title1 -- DuplicatedIdentifyingFields -- Multiple elements in this request are using the same unique fields (Title1)"));
        }
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenFieldTitleIsNull() {
        List<DatasetRequest> requests = new ArrayList<>();

        requests.add(DatasetRequest.builder()
                .description("Missing title")
                .build());
        try {
            service.validateRequest(requests, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Request:1 -- fieldIsNullOrMissing -- title was null or missing"));
        }
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenFieldsAreEmpty() {
        List<DatasetRequest> requests = new ArrayList<>();
        String localDateTime = LocalDateTime.now().toString();

        requests.add(DatasetRequest.builder()
                .title("Title1")
                .description("")
                .categories(List.of(""))
                .provenances(List.of("Provenance"))
                .pi("false")
                .issued(localDateTime)
                .keywords(List.of("Keywords"))
                .theme("Theme")
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());
        try {
            service.validateRequest(requests, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(2));
            assertThat(e.toErrorString(), is("Request:1 -- fieldIsNullOrMissing -- description was null or missing, " +
                    "Request:1 -- fieldIsNullOrMissing -- categories was null or missing"));
        }
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenCreatingExistingDataset() {
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
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());

        Dataset existingDataset = new Dataset().convertNewFromRequest(requests.get(0), REST);

        when(datasetRepository.findByTitle("Title1")).thenReturn(Optional.of(existingDataset));

        try {
            service.validateRequest(requests, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Request:1 -- creatingExistingDataset -- " +
                    "The dataset Title1 already exists and therefore cannot be created"));
        }
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenTryingToUpdateNonExistingDataset() {
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
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());

        when(datasetRepository.findByTitle("Title1")).thenReturn(Optional.empty());

        try {
            service.validateRequest(requests, true, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Request:1 -- updatingNonExistingDataset -- " +
                    "The dataset Title1 does not exist and therefore cannot be updated"));
        }
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenNonCorrelatingMaster() {
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
                .haspart(List.of("Haspart"))
                .distributionChannels(List.of("DistributionChannel"))
                .build());

        Dataset existingDataset = new Dataset().convertNewFromRequest(requests.get(0), GITHUB);

        when(datasetRepository.findByTitle("Title1")).thenReturn(Optional.of(existingDataset));

        try {
            service.validateRequest(requests, true, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Request:1 -- nonCorrelatingMaster -- " +
                    "The dataset Title1 is mastered in GITHUB and therefore cannot be updated from REST"));
        }
    }

}
