package no.nav.data.polly.term;

import no.nav.data.polly.term.domain.PollyTerm;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@ConditionalOnMissingBean(TermService.class)
public class TermStub implements TermService {

    @Override
    public List<PollyTerm> searchTerms(String searchString) {
        return List.of();
    }

    @Override
    public Optional<PollyTerm> getTerm(String termId) {
        return Optional.empty();
    }
}
