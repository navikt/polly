package no.nav.data.polly.process.domain;

import java.util.List;

public interface ProcessRepositoryCustom {

    List<Process> findByGDPRArticle(String gdpr);

    List<Process> findByNationalLaw(String nationalLaw);

    List<Process> findByProduct(String product);

    List<Process> findBySubDepartment(String subDepartment);

    List<Process> findByProductTeam(String productTeam);

    List<Process> findByDocumentId(String documentId);

}
