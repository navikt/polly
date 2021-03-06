package no.nav.data.polly.teams;

import no.nav.data.common.rest.RestResponsePage;
import no.nav.data.polly.teams.dto.Resource;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;

public interface ResourceService {

    Optional<Resource> getResource(String ident);

    Map<String, Resource> getResources(Collection<String> ident);

    RestResponsePage<Resource> search(String name);
}
