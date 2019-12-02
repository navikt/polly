package no.nav.data.polly.teams.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductTeamResponse {

    private String id;
    private String name;

    // temporary name = id constructor
    public ProductTeamResponse(String teamName) {
        this(teamName, teamName);
    }
}
