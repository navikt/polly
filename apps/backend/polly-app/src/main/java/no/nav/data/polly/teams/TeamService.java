package no.nav.data.polly.teams;

import no.nav.data.polly.teams.domain.ProductArea;
import no.nav.data.polly.teams.domain.Team;

import java.util.List;
import java.util.Optional;

public interface TeamService {

    List<Team> getAllTeams();

    Optional<Team> getTeam(String teamId);

    List<ProductArea> getAllProductAreas();

    Optional<ProductArea> getProductArea(String productAreaId);

    List<Team> getTeamsForProductArea(String productAreaId);

    boolean teamExists(String teamId);
}
