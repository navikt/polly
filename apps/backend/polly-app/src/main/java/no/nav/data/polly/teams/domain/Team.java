package no.nav.data.polly.teams.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.dto.ProductTeamResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Team {

    private String id;
    private String name;

    public ProductTeamResponse convertToResponse() {
        return new ProductTeamResponse(id, name);
    }
}
