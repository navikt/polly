package no.nav.data.polly.disclosure.domain;

import java.util.List;
import java.util.UUID;

public interface DisclosureRepositoryCustom {

    List<Disclosure> findByGDPRArticle(String category);

    List<Disclosure> findByNationalLaw(String source);

    List<Disclosure> findByRecipient(String source);

    List<Disclosure> findByInformationTypeId(UUID informationTypeId);

    List<Disclosure> findByProcessId(UUID processId);

    List<Disclosure> findByProductTeam(String productTeam);
}
