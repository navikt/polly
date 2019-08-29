package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.codelist.CodelistStub;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelationRepository;
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

import static no.nav.data.catalog.backend.app.dataset.DatasetMaster.REST;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class DatasetServiceTest {

    @Mock
    private DatasetRelationRepository datasetRelationRepository;

    @Mock
    private DatasetRepository datasetRepository;

    @InjectMocks
    private DatasetService service;

    @Before
    public void setUp() {
        CodelistStub.initializeCodelist();
    }

    // findDatasetWithAllDescendandts

    // findAllRootDatasets

    // validate
    @Test
    public void validate_shouldThrowValidationException_whenListOfRequestsIsNull() {
        try {
            service.validate(null, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(),
                    is("RequestNotAccepted -- RequestWasNullOrEmpty -- The request was not accepted because it is null or empty"));
        }
    }

    @Test
    public void validate_shouldThrowValidationException_whenListOfRequestsIsEmpty() {
        List<DatasetRequest> requests = Collections.emptyList();
        try {
            service.validate(requests, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(),
                    is("RequestNotAccepted -- RequestWasNullOrEmpty -- The request was not accepted because it is null or empty"));
        }
    }

    @Test
    public void validate_shouldThrowValidationException_withDuplicatedElementInRequest() {
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
                .accessRights("AccesRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistribusjonChannel"))
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
                .accessRights("AccesRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistribusjonChannel"))
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
                .accessRights("AccesRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistribusjonChannel"))
                .build());
        try {
            service.validate(requests, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Request:3 -- DuplicateElement -- The dataset Title1 is not unique because it has already been used in this request (see request:1)"));
        }
    }

    @Test
    public void validate_shouldThrowValidationException_withDuplicatedIdentifyingFieldsInRequest() {
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
                .accessRights("AccesRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistribusjonChannel"))
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
                .accessRights("AccesRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistribusjonChannel"))
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
                .accessRights("AccesRights")
                .publisher("Publisher")
                .spatial("Spatial")
                .haspart("Haspart")
                .distributionChannels(List.of("DistribusjonChannel"))
                .build());
        try {
            service.validate(requests, false, REST);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(1));
            assertThat(e.toErrorString(), is("Title1 -- DuplicatedIdentifyingFields -- Multipe elements in this request are using the same unique fields (Title1)"));
        }
    }

    // validateRequestsAndReturnErrors

    // validateNoDuplicates

    // returnUpdatedDatasetsIfAllArePresent
}
