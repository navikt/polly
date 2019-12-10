package no.nav.data.polly.process.domain;

import java.util.List;

public interface ProcessRepositoryCustom {

    List<Process> findByGDPRArticle(String gdpr);

    List<Process> findByNationalLaw(String nationalLaw);
}
