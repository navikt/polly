package no.nav.data.polly.term;

import no.nav.data.polly.term.domain.PollyTerm;

import java.util.List;
import java.util.Optional;

public interface TermService {

    List<PollyTerm> searchTerms(String searchString);

    Optional<PollyTerm> getTerm(String termId);
}
