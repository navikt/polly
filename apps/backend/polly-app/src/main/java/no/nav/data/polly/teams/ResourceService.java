package no.nav.data.polly.teams;

import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.teams.dto.Resource;

import java.util.Optional;

public interface ResourceService {

    Optional<Resource> getResource(String ident);

    RestResponsePage<Resource> search(String name);
}
