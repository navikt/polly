package no.nav.data.polly.document.domain;

import java.util.List;
import java.util.UUID;

public interface DocumentRepositoryCustom {

    List<Document> findByInformationTypeId(UUID informationTypeId);

    List<Document> findBySubjectCategory(String subjectCategory);


}
