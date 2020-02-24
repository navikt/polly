package no.nav.data.polly.teams;

import no.nav.data.polly.teams.domain.Team;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@ConditionalOnMissingBean(TeamService.class)
public class TeamStub implements TeamService {

    @Override
    public List<Team> getAllTeams() {
        return List.of();
    }

    @Override
    public Optional<Team> getTeam(String teamId) {
        return Optional.empty();
    }

    @Override
    public boolean teamExists(String teamId) {
        return false;
    }
}
