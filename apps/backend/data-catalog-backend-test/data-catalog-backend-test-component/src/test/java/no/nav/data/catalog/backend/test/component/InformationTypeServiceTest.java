package no.nav.data.catalog.backend.test.component;

import no.nav.data.catalog.backend.app.codelist.CodelistRepository;
import no.nav.data.catalog.backend.app.common.exceptions.ValidationException;
import no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationType;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRepository;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeRequest;
import no.nav.data.catalog.backend.app.informationtype.InformationTypeService;
import org.elasticsearch.client.RestHighLevelClient;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static no.nav.data.catalog.backend.app.elasticsearch.ElasticsearchStatus.*;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ComponentTestConfig.class)
@ActiveProfiles("test")
@EnableJpaRepositories(repositoryBaseClass = CodelistRepository.class)
public class InformationTypeServiceTest {

    @Mock
    private InformationTypeRepository informationTypeRepository;

    @Mock
    private ElasticsearchRepository elasticsearchRepository;

    @Mock
    private RestHighLevelClient highLevelClient;

	@InjectMocks
	private InformationTypeService informationTypeService;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	@Test
	public void shouldSyncCreatedInformationTypes() {
	    InformationType informationType = InformationType.builder().build();
        List<InformationType> informationTypes = new ArrayList<>();
        informationTypes.add(informationType);
		when(informationTypeRepository.findByElasticsearchStatus(TO_BE_CREATED)).thenReturn(Optional.of(informationTypes));

		informationTypeService.synchToElasticsearch();
		verify(elasticsearchRepository, times(1)).insertInformationType(anyMap());
        verify(elasticsearchRepository, times(0)).updateInformationTypeById(anyString(), anyMap());
        verify(elasticsearchRepository, times(0)).deleteInformationTypeById(anyString());
        verify(informationTypeRepository, times(1)).save(any(InformationType.class));
        verify(informationTypeRepository, times(0)).deleteById(anyLong());
	}

    @Test
    public void shouldSyncUpdatedInformationTypes() {
        InformationType informationType = InformationType.builder().build();
        List<InformationType> informationTypes = new ArrayList<>();
        informationTypes.add(informationType);
        when(informationTypeRepository.findByElasticsearchStatus(TO_BE_UPDATED)).thenReturn(Optional.of(informationTypes));

        informationTypeService.synchToElasticsearch();
        verify(elasticsearchRepository, times(0)).insertInformationType(anyMap());
        verify(elasticsearchRepository, times(1)).updateInformationTypeById(any(), anyMap());
        verify(elasticsearchRepository, times(0)).deleteInformationTypeById(anyString());
        verify(informationTypeRepository, times(1)).save(any(InformationType.class));
        verify(informationTypeRepository, times(0)).deleteById(anyLong());
    }

    @Test
    public void shouldSyncDeletedInformationTypes() {
        InformationType informationType = InformationType.builder().build();
        List<InformationType> informationTypes = new ArrayList<>();
        informationTypes.add(informationType);
        when(informationTypeRepository.findByElasticsearchStatus(TO_BE_DELETED)).thenReturn(Optional.of(informationTypes));

        informationTypeService.synchToElasticsearch();
        verify(elasticsearchRepository, times(0)).insertInformationType(anyMap());
        verify(elasticsearchRepository, times(0)).updateInformationTypeById(any(), anyMap());
        verify(elasticsearchRepository, times(1)).deleteInformationTypeById(any());
        verify(informationTypeRepository, times(0)).save(any(InformationType.class));
        verify(informationTypeRepository, times(1)).deleteById(any());
    }

    @Test
    public void shouldValidateInsertRequest() {
	    InformationTypeRequest request = InformationTypeRequest.builder()
				.category("PERSONALIA")
				.name("Name")
				.system("TPS")
				.producer("SKATTEETATEN")
				.personalData(true)
				.build();
	    informationTypeService.validateRequest(request, false);
    }

    @Test
    public void shouldThrowValidationExceptionOnInsert() {
        InformationTypeRequest request = InformationTypeRequest.builder().build();
        try {
            informationTypeService.validateRequest(request, false);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(5));
            assertThat(e.get().get("system"), is("The system was null or not found in the system codelist."));
            assertThat(e.get().get("name"), is("Name must have value"));
            assertThat(e.get().get("personalData"), is("PersonalData cannot be null"));
            assertThat(e.get().get("producer"), is("The producer was null or not found in the producer codelist."));
            assertThat(e.get().get("category"), is("The category was null or not found in the category codelist."));
        }
    }

    @Test
    public void shouldThrowValidationExceptionOnUpdate() {
        InformationTypeRequest request = InformationTypeRequest.builder().build();
        try {
            informationTypeService.validateRequest(request, true);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(5));
            assertThat(e.get().get("system"), is("The system was null or not found in the system codelist."));
            assertThat(e.get().get("name"), is("Name must have value"));
            assertThat(e.get().get("personalData"), is("PersonalData cannot be null"));
            assertThat(e.get().get("producer"), is("The producer was null or not found in the producer codelist."));
            assertThat(e.get().get("category"), is("The category was null or not found in the category codelist."));
        }
    }

    @Test
    public void shouldThrowValidationExceptionOnInsertNameExists() {
	    when(informationTypeRepository.findByName(anyString())).thenReturn(Optional.of(new InformationType()));
        InformationTypeRequest request = InformationTypeRequest.builder().name("NotFound").build();
        try {
            informationTypeService.validateRequest(request, false);
        } catch (ValidationException e) {
            assertThat(e.get().size(), is(5));
            assertThat(e.get().get("name"), is("This name is used for an existing information type."));
            assertThat(e.get().get("system"), is("The system was null or not found in the system codelist."));
            assertThat(e.get().get("personalData"), is("PersonalData cannot be null"));
            assertThat(e.get().get("producer"), is("The producer was null or not found in the producer codelist."));
            assertThat(e.get().get("category"), is("The category was null or not found in the category codelist."));
        }
    }
}
