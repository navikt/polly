package no.nav.data.polly.policy.domain;

import java.util.List;
import java.util.UUID;

public interface PolicyRepositoryCustom {

    List<Policy> findBySubjectCategory(String subjectCategory);

    List<Policy> findByGDPRArticle(String category);

    List<Policy> findByNationalLaw(String source);

    List<Policy> findByDocumentId(UUID id);
}
