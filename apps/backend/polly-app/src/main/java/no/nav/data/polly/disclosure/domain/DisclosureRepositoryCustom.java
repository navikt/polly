package no.nav.data.polly.disclosure.domain;

import java.util.List;

public interface DisclosureRepositoryCustom {

    List<Disclosure> findByGDPRArticle(String category);

    List<Disclosure> findByNationalLaw(String source);

    List<Disclosure> findBySource(String source);

}
