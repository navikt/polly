package no.nav.data.polly.teams;

import no.nav.data.polly.common.rest.RestResponsePage;
import no.nav.data.polly.teams.dto.Resource;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@ConditionalOnMissingBean(ResourceService.class)
public class ResourceStub implements ResourceService {

    @Override
    public Optional<Resource> getResource(String ident) {
        return Optional.empty();
    }

    @Override
    public RestResponsePage<Resource> search(String name) {
        return new RestResponsePage<>(List.of());
    }
}
