package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.codelist.CodelistStub;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelShort;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.dataset.DatacatalogMaster.GITHUB;
import static no.nav.data.catalog.backend.app.dataset.DatacatalogMaster.REST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DatasetServiceTest {

    @Mock
    private DatasetRepository datasetRepository;

    @Mock
    private DistributionChannelRepository distributionChannelRepository;

    @InjectMocks
    private DatasetService service;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
    }

    @Test
    void save_shouldSave_whenRequestIsValid() {
        mockRelations();
        DatasetRequest request = createValidDatasetRequest("Title");

        service.saveAll(List.of(request), REST);
        verify(datasetRepository, times(1)).saveAll(anyList());
    }

    @Test
    void update_shouldUpdate_whenRequestIsValid() {
        when(datasetRepository.findAllByTitle(Collections.singletonList("Title"))).thenReturn(Collections.singletonList(new Dataset()));
        DatasetRequest request = createValidDatasetRequest("Title");

        service.updateAll(List.of(request));
        verify(datasetRepository, times(1)).saveAll(anyList());
    }

    @Test
    void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsNull() {
        service.validateRequest(null);
    }

    @Test
    void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<DatasetRequest> requests = Collections.emptyList();
        service.validateRequest(requests);
    }

    @Disabled("Until generic test for RequestValidation is written")
    @Test
    void validateRequest_shouldThrowValidationException_withDuplicatedElementInRequest() {
        DatasetRequest title1 = createValidDatasetRequest("Title1");
        DatasetRequest title2 = createValidDatasetRequest("Title2");

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(new ArrayList<>(List.of(title1, title2, title1))));
        assertThat(exception)
                .hasMessageContaining("Request:3 -- DuplicateElement -- The dataset Title1 is not unique because it has already been used in this request (see request:1)");
    }

    @Test
    void validateRequest_shouldThrowValidationException_withDuplicatedIdentifyingFieldsInRequest() {
        DatasetRequest title1 = createValidDatasetRequest("Title1");
        DatasetRequest title2 = createValidDatasetRequest("Title2");
        DatasetRequest title3 = createValidDatasetRequest("Title1");
        title3.setDescription("Not equal object as the request1");

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(new ArrayList<>(List.of(title1, title2, title3))));
        assertThat(exception).hasMessageContaining("Title1 -- DuplicatedIdentifyingFields -- Multiple elements in this request are using the same unique fields (Title1)");
    }

    @Disabled("Until generic test for RequestValidation is written")
    @Test
    void validateRequest_shouldThrowValidationException_whenFieldTitleIsNull() {
        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(createValidDatasetRequest(null))));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- title was null or missing");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldCategoriesInvalid() {
        DatasetRequest request = createValidDatasetRequest("Title1");
        request.setCategories(List.of("doesntexist"));

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- categories: doesntexist code not found in codelist CATEGORY");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldContentTypeMissing() {
        DatasetRequest request = createValidDatasetRequest("Title");
        request.setContentType(null);

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- contentType was null or missing");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldContentTypeInvalid() {
        DatasetRequest request = createValidDatasetRequest("Title");
        request.setContentType("invalid-type");

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- contentType: invalid-type was invalid for type ContentType");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenFieldTitleIsEmpty() {
        DatasetRequest request = createValidDatasetRequest("");

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- fieldIsNullOrMissing -- title was null or missing");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenCreatingExistingDataset() {
        List<DatasetRequest> requests = List.of(createValidDatasetRequest("Title"));
        Dataset existingDataset = new Dataset().convertNewFromRequest(requests.get(0), REST);

        when(datasetRepository.findByTitle("Title")).thenReturn(Optional.of(existingDataset));

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(requests));
        assertThat(exception).hasMessageContaining("Request:1 -- creatingExistingDataset --");
        assertThat(exception).hasMessageContaining("The dataset Title already exists and therefore cannot be created");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenTryingToUpdateNonExistingDataset() {
        when(datasetRepository.findByTitle("Title")).thenReturn(Optional.empty());

        DatasetRequest request = createValidDatasetRequest("Title");
        request.setUpdate(true);
        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- updatingNonExistingDataset --");
        assertThat(exception).hasMessageContaining("The dataset Title does not exist and therefore cannot be updated");
    }

    @Test
    void validateRequest_shouldThrowValidationException_whenNonCorrelatingMaster() {
        DatasetRequest request = createValidDatasetRequest("Title");
        request.setUpdate(true);

        Dataset existingDataset = new Dataset().convertNewFromRequest(request, GITHUB);

        when(datasetRepository.findByTitle("Title")).thenReturn(Optional.of(existingDataset));

        Exception exception = assertThrows(Exception.class, () -> service.validateRequest(List.of(request)));
        assertThat(exception).hasMessageContaining("Request:1 -- nonCorrelatingMaster --");
        assertThat(exception).hasMessageContaining("The dataset Title is mastered in GITHUB and therefore cannot be updated from REST");
    }

    private DatasetRequest createValidDatasetRequest(String title) {
        return DatasetRequest.builder()
                .contentType(ContentType.DATASET.name())
                .title(title)
                .description("Description")
                .categories(List.of("Personalia"))
                .provenances(List.of("ARBEIDSGIVER"))
                .pi("false")
                .issued(LocalDateTime.now().toString())
                .keywords(List.of("Keywords"))
                .themes(Collections.singletonList("Theme"))
                .accessRights("AccessRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart(List.of("Haspart"))
                .distributionChannels(Collections.singletonList(new DistributionChannelShort("DistributionChannel", DistributionChannelType.KAFKA.name())))
                .datacatalogMaster(REST)
                .requestIndex(1)
                .build();
    }

    private void mockRelations() {
        when(datasetRepository.findAllByTitle(Collections.singletonList("Haspart"))).thenReturn(Collections.singletonList(new Dataset()));
        when(distributionChannelRepository.findAllByNameIn(Collections.singletonList("DistributionChannel")))
                .thenReturn(Collections.singletonList(DistributionChannel.builder().name("name").type(DistributionChannelType.KAFKA).build()));
    }
}
