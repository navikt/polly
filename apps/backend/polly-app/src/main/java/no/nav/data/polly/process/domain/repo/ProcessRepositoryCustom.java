package no.nav.data.polly.process.domain.repo;

import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.dto.StateDbRequest;

import java.util.List;

public interface ProcessRepositoryCustom {

    List<Process> findByGDPRArticle(String gdpr);

    List<Process> findByNationalLaw(String nationalLaw);

    List<Process> findByProduct(String product);

    List<Process> findBySubDepartment(String subDepartment);

    List<Process> findByProductTeam(String productTeam);

    List<Process> findByProductTeams(List<String> productTeams);

    List<Process> findByDocumentId(String documentId);

    List<Process> findForState(StateDbRequest stateDbRequest);

}
