package no.nav.data.polly.policy.domain;

import java.util.List;

public interface PolicyRepositoryCustom {

    List<Policy> findBySubjectCategory(String subjectCategory);

    List<Policy> findByGDPRArticle(String category);

    List<Policy> findByNationalLaw(String source);
}
