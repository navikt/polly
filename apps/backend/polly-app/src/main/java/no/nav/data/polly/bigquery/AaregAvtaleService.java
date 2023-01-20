package no.nav.data.polly.bigquery;

import no.nav.data.polly.bigquery.domain.PollyAaregAvtale;

import java.util.List;
import java.util.Optional;

public interface AaregAvtaleService {

    List<PollyAaregAvtale> searchAaregAvtale(String searchString);

    Optional<PollyAaregAvtale> getAaregAvtale(String avtaleId);
}
