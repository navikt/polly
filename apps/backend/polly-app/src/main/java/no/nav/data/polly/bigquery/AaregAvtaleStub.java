package no.nav.data.polly.bigquery;

import no.nav.data.polly.bigquery.domain.PollyAaregAvtale;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@ConditionalOnMissingBean(AaregAvtaleService.class)
public class AaregAvtaleStub implements AaregAvtaleService {

    @Override
    public List<PollyAaregAvtale> searchAaregAvtale(String searchString) {
        return List.of();
    }

    @Override
    public Optional<PollyAaregAvtale> getAaregAvtale(String avtaleId) {
        return Optional.empty();
    }

}
