package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.codelist.CodelistStub;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannel;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelRepository;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelShort;
import no.nav.data.catalog.backend.app.distributionchannel.DistributionChannelType;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.dataset.DatacatalogMaster.GITHUB;
import static no.nav.data.catalog.backend.app.dataset.DatacatalogMaster.REST;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class DatasetServiceTest {

    @Mock
    private DatasetRepository datasetRepository;

    @Mock
    private DistributionChannelRepository distributionChannelRepository;

    @InjectMocks
    private DatasetService service;

    @Rule
    public ExpectedException exception = ExpectedException.none();

    @Before
    public void setUp() {
        when(datasetRepository.findAllByTitle(Collections.singletonList("Haspart"))).thenReturn(Collections.singletonList(new Dataset()));
        when(distributionChannelRepository.findAllByName(Collections.singletonList("DistributionChannel")))
                .thenReturn(Collections.singletonList(DistributionChannel.builder().name("name").type(DistributionChannelType.KAFKA).build()));
        CodelistStub.initializeCodelist();
    }

    @Test
    public void save_shouldSave_whenRequestIsValid() {
        DatasetRequest request = createValidDatasetRequest("Title");

        service.saveAll(List.of(request), REST);
        verify(datasetRepository, times(1)).saveAll(anyList());
    }

    @Test
    public void update_shouldUpdate_whenRequestIsValid() {
        DatasetRequest request = createValidDatasetRequest("Title");

        service.updateAll(List.of(request));
        verify(datasetRepository, times(1)).saveAll(anyList());
    }

    @Test
    public void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsNull() {
        service.validateRequest(null);
    }

    @Test
    public void validateRequest_shouldValidateWithoutAnyProcessing_whenListOfRequestsIsEmpty() {
        List<DatasetRequest> requests = Collections.emptyList();
        service.validateRequest(requests);
    }

    @Test
    public void validateRequest_shouldThrowValidationException_withDuplicatedElementInRequest() {
        exception.expectMessage("Request:3 -- DuplicateElement -- The dataset Title1 is not unique because it has already been used in this request (see request:1)");
        DatasetRequest title1 = createValidDatasetRequest("Title1");
        DatasetRequest title2 = createValidDatasetRequest("Title2");
        DatasetRequest title3 = title1;

        service.validateRequest(new ArrayList<>(List.of(title1, title2, title3)));
    }

    @Test
    public void validateRequest_shouldThrowValidationException_withDuplicatedIdentifyingFieldsInRequest() {
        exception.expectMessage("Title1 -- DuplicatedIdentifyingFields -- Multiple elements in this request are using the same unique fields (Title1)");
        DatasetRequest title1 = createValidDatasetRequest("Title1");
        DatasetRequest title2 = createValidDatasetRequest("Title2");
        DatasetRequest title3 = createValidDatasetRequest("Title1");
        title3.setDescription("Not equal object as the request1");

        service.validateRequest(new ArrayList<>(List.of(title1, title2, title3)));
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenFieldTitleIsNull() {
        exception.expectMessage("Request:1 -- fieldIsNullOrMissing -- title was null or missing");

        service.validateRequest(List.of(createValidDatasetRequest(null)));
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenFieldCategoriesInvalid() {
        exception.expectMessage("Request:1 -- fieldIsNullOrMissing -- categories: DOESNTEXIST code not found in codelist CATEGORY");
        DatasetRequest request = createValidDatasetRequest("Title1");
        request.setCategories(List.of("doesntexist"));

        service.validateRequest(List.of(request));
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenFieldContentTypeMissing() {
        exception.expectMessage("Request:1 -- fieldIsNullOrMissing -- contentType was null or missing");
        DatasetRequest request = createValidDatasetRequest("Title");
        request.setContentType(null);

        service.validateRequest(List.of(request));
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenFieldContentTypeInvalid() {
        exception.expectMessage("Request:1 -- fieldIsNullOrMissing -- contentType was invalid for type ContentType");
        DatasetRequest request = createValidDatasetRequest("Title");
        request.setContentType("invalid-type");

        service.validateRequest(List.of(request));
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenFieldTitleIsEmpty() {
        exception.expectMessage("Request:1 -- fieldIsNullOrMissing -- title was null or missing");
        DatasetRequest request = createValidDatasetRequest("");

        service.validateRequest(List.of(request));
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenCreatingExistingDataset() {
        exception.expectMessage("Request:1 -- creatingExistingDataset --");
        exception.expectMessage("The dataset Title already exists and therefore cannot be created");
        List<DatasetRequest> requests = List.of(createValidDatasetRequest("Title"));
        Dataset existingDataset = new Dataset().convertNewFromRequest(requests.get(0), REST);

        when(datasetRepository.findByTitle("Title")).thenReturn(Optional.of(existingDataset));

        service.validateRequest(requests);
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenTryingToUpdateNonExistingDataset() {
        exception.expectMessage("Request:1 -- updatingNonExistingDataset --");
        exception.expectMessage("The dataset Title does not exist and therefore cannot be updated");

        when(datasetRepository.findByTitle("Title")).thenReturn(Optional.empty());

        DatasetRequest request = createValidDatasetRequest("Title");
        request.setUpdate(true);
        service.validateRequest(List.of(request));
    }

    @Test
    public void validateRequest_shouldThrowValidationException_whenNonCorrelatingMaster() {
        exception.expectMessage("Request:1 -- nonCorrelatingMaster --");
        exception.expectMessage("The dataset Title is mastered in GITHUB and therefore cannot be updated from REST");
        DatasetRequest requst = createValidDatasetRequest("Title");
        requst.setUpdate(true);

        Dataset existingDataset = new Dataset().convertNewFromRequest(requst, GITHUB);

        when(datasetRepository.findByTitle("Title")).thenReturn(Optional.of(existingDataset));

        service.validateRequest(List.of(requst));
    }

    private DatasetRequest createValidDatasetRequest(String title) {
        return DatasetRequest.builder()
                .contentType(ContentType.DATASET.name())
                .title(title)
                .description("Description")
                .categories(List.of("Personalia"))
                .provenances(List.of("Provenance"))
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

}
