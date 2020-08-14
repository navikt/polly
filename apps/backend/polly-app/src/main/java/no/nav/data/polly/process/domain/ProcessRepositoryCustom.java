package no.nav.data.polly.process.domain;

import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import org.springframework.lang.Nullable;

import java.util.List;

public interface ProcessRepositoryCustom {

    List<Process> findByGDPRArticle(String gdpr);

    List<Process> findByNationalLaw(String nationalLaw);

    List<Process> findByProduct(String product);

    List<Process> findBySubDepartment(String subDepartment);

    List<Process> findByProductTeam(String productTeam);

    List<Process> findByDocumentId(String documentId);

    List<Process> findForState(ProcessField processField, ProcessState processState, @Nullable String department, @Nullable ProcessStatus status);

    long countForState(ProcessField processField, ProcessState processState, @Nullable String department, @Nullable ProcessStatus status);

}
