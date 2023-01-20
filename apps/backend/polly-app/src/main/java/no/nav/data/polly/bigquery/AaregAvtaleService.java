package no.nav.data.polly.bigquery;

import no.nav.data.polly.bigquery.domain.AaregAvtale;

import java.util.List;
import java.util.Optional;

public interface AaregAvtaleService {

    List<AaregAvtale> searchAaregAvtale(String searchString);

    Optional<AaregAvtale> getAaregAvtale(String avtaleId);
}
