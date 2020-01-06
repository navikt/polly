package no.nav.data.polly.teams;

import no.nav.data.polly.teams.domain.Team;

import java.util.List;

public interface TeamService {

    List<Team> getAllProductTeams();

    Team getTeam(String teamId);

    boolean teamExists(String teamId);
}
