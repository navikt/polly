package no.nav.data.polly.informationtype;

import no.nav.data.polly.codelist.CodelistStub;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeRequest;
import no.nav.data.polly.term.TermService;
import no.nav.data.polly.term.domain.PollyTerm;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InformationTypeServiceTest {

    @Mock
    private InformationTypeRepository informationTypeRepository;
    @Mock
    private TermService termService;

    @InjectMocks
    private InformationTypeService service;

    @BeforeEach
    void setUp() {
        CodelistStub.initializeCodelist();
        lenient().when(termService.getTerm("term")).thenReturn(Optional.of(new PollyTerm()));
    }

    @Test
    void save_shouldSave_whenRequestIsValid() {
        InformationTypeRequest request = createValidInformationTypeRequest("Name");

        service.saveAll(List.of(request));
        verify(informationTypeRepository, times(1)).saveAll(anyList());
    }

    @Test
    void update_shouldUpdate_whenRequestIsValid() {
        InformationTypeRequest request = createValidInformationTypeUpdateRequest();
        when(informationTypeRepository.findAllById(List.of(request.getIdAsUUID()))).thenReturn(Collections.singletonList(new InformationType()));

        service.updateAll(List.of(request));
        verify(informationTypeRepository, times(1)).saveAll(anyList());
    }

    private InformationTypeRequest createValidInformationTypeUpdateRequest() {
        InformationTypeRequest req = createValidInformationTypeRequest("Name");
        req.setId(UUID.randomUUID().toString());
        return req;
    }

    private InformationTypeRequest createValidInformationTypeRequest(String name) {
        return InformationTypeRequest.builder()
                .name(name)
                .term("term")
                .description("Description")
                .sensitivity("pol")
                .orgMaster("TPS")
                .categories(List.of("Personalia"))
                .sources(List.of("Skatt"))
                .keywords(List.of("Keywords"))
                .requestIndex(1)
                .build();
    }

}
