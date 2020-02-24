package no.nav.data.polly.teams;

import no.nav.data.polly.teams.domain.Team;

import java.util.List;
import java.util.Optional;

public interface TeamService {

    List<Team> getAllTeams();

    Optional<Team> getTeam(String teamId);

    boolean teamExists(String teamId);
}
