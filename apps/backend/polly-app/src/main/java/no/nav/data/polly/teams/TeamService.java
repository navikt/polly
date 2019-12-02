package no.nav.data.polly.teams;

import no.nav.data.polly.teams.dto.ProductTeamResponse;
import no.nav.data.polly.teams.nora.NoraClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Service
public class TeamService {

    private final NoraClient noraClient;

    public TeamService(NoraClient noraClient) {
        this.noraClient = noraClient;
    }

    public List<ProductTeamResponse> getAllProductTeams() {
        return convert(noraClient.getTeamNames(), ProductTeamResponse::new);
    }

    public boolean teamExists(String teamId) {
        return noraClient.getTeamNames().contains(teamId);
    }
}
