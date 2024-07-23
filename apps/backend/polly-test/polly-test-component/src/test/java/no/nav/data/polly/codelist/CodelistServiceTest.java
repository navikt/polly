package no.nav.data.polly.codelist;

import no.nav.data.common.exceptions.CodelistNotErasableException;
import no.nav.data.common.exceptions.CodelistNotFoundException;
import no.nav.data.polly.codelist.codeusage.CodeUsageService;
import no.nav.data.polly.codelist.domain.Codelist;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.codelist.dto.CodeUsageResponse;
import no.nav.data.polly.codelist.dto.CodelistRequest;
import no.nav.data.polly.codelist.dto.CodelistRequestValidator;
import no.nav.data.polly.process.dto.ProcessShortResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.AdditionalAnswers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static no.nav.data.polly.codelist.CodelistUtils.createCodelist;
import static no.nav.data.polly.codelist.CodelistUtils.createCodelistRequest;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("static-access") // TODO: Fjern når dette ikke trengs
class CodelistServiceTest {

    @Mock
    private CodelistRepository repository;

    @Mock
    private CodeUsageService codeUsageService;

    @InjectMocks
    private CodelistRequestValidator crv;

    private CodelistService service;
    
    @BeforeEach
    void init() {
        service = new CodelistService(repository, crv);
    }

    @Test
    void save_shouldSaveCodelist_whenRequestIsValid() {
        when(repository.saveAll(anyList())).thenAnswer(AdditionalAnswers.returnsFirstArg());
        service.save(List.of(createCodelist(ListName.THIRD_PARTY, "TEST_CODE", "Test shortName", "Test description")));
        verify(repository, times(1)).saveAll(anyList());
        assertThat(CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "TEST_CODE").getShortName()).isEqualTo("Test shortName");
        assertThat(CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "TEST_CODE").getDescription()).isEqualTo("Test description");
    }

    @Test
    void update_shouldUpdateCodelist_whenRequestIsValid() {
        saveCodelist(createCodelist(ListName.THIRD_PARTY, "CODE", "name1", "desc1"));

        CodelistRequest request = createCodelistRequest();
        request.setShortName("name2");
        request.setDescription("desc2");

        when(repository.findByListAndCode(ListName.THIRD_PARTY, "CODE")).thenReturn(Optional.of(request.convertToCodelist()));
        when(repository.saveAll(List.of(request.convertToCodelist()))).thenReturn(List.of(request.convertToCodelist()));

        service.update(List.of(request));

        verify(repository, times(1)).saveAll(anyList());
        Codelist codelist = CodelistStaticService.getCodelist(ListName.THIRD_PARTY, request.getCode());
        assertThat(codelist.getShortName()).isEqualTo("name2");
        assertThat(codelist.getDescription()).isEqualTo("desc2");
    }

    @Test
    void delete_shouldDelete_whenListAndCodeExists() {
        when(repository.findByListAndCode(ListName.THIRD_PARTY, "DELETE_CODE")).thenReturn(Optional.of(createCodelist(ListName.THIRD_PARTY, "DELETE_CODE")));
        when(codeUsageService.findCodeUsage(ListName.THIRD_PARTY, "DELETE_CODE")).thenReturn(new CodeUsageResponse(ListName.THIRD_PARTY, "DELETE_CODE"));

        service.delete(ListName.THIRD_PARTY, "DELETE_CODE");

        verify(repository, times(1)).delete(any(Codelist.class));
        assertNull(CodelistStaticService.getCodelist(ListName.THIRD_PARTY, "DELETE_CODE"));
    }

    @Test
    void delete_shouldThrowCodelistNotFoundException_whenCodeDoesNotExist() {
        when(repository.findByListAndCode(ListName.THIRD_PARTY, "UNKNOWN_CODE")).thenReturn(Optional.empty());

        try {
            service.delete(ListName.THIRD_PARTY, "UNKNOWN_CODE");
            fail();
        } catch (CodelistNotFoundException e) {
            assertThat(e.getLocalizedMessage()).isEqualTo("Cannot find a codelist to delete with code=UNKNOWN_CODE and listName=THIRD_PARTY");
        }
    }

    @Test
    void delete_shouldThrowCodelistNotErasableException_whenCodelistIsInUse() {
        CodeUsageResponse codeUsage = new CodeUsageResponse(ListName.THIRD_PARTY, "DELETE_CODE");
        codeUsage.setProcesses(List.of(ProcessShortResponse.builder().id(UUID.randomUUID()).name("name").build()));
        when(repository.findByListAndCode(ListName.PURPOSE, "DELETE_CODE")).thenReturn(Optional.of(createCodelist(ListName.THIRD_PARTY, "DELETE_CODE")));
        //when(crv.validateCodelistIsNotInUse(ListName.PURPOSE, "DELETE_CODE"));
        when(codeUsageService.findCodeUsage(ListName.PURPOSE, "DELETE_CODE")).thenReturn(codeUsage);

        try {
            service.delete(ListName.PURPOSE, "DELETE_CODE");
            fail();
        } catch (CodelistNotErasableException e) {
            assertThat(e.getLocalizedMessage()).contains("The code DELETE_CODE in list PURPOSE cannot be erased");
        }
    }
    
    @Test
    void delete_shouldThrowCodelistNotErasableException_whenCodelistIsInUse2() {
        CodeUsageResponse codeUsage = new CodeUsageResponse(ListName.THIRD_PARTY, "DELETE_CODE");
        codeUsage.setProcesses(List.of(ProcessShortResponse.builder().id(UUID.randomUUID()).name("name").build()));
        when(repository.findByListAndCode(ListName.PURPOSE, "DELETE_CODE")).thenReturn(Optional.of(createCodelist(ListName.THIRD_PARTY, "DELETE_CODE")));
        when(codeUsageService.findCodeUsage(ListName.PURPOSE, "DELETE_CODE")).thenReturn(codeUsage);

        try {
            service.delete(ListName.PURPOSE, "DELETE_CODE");
            fail();
        } catch (CodelistNotErasableException e) {
            assertThat(e.getLocalizedMessage()).contains("The code DELETE_CODE in list PURPOSE cannot be erased");
        }
    }


    private void saveCodelist(Codelist codelist) {
        CodelistCache.set(codelist);
    }
}
