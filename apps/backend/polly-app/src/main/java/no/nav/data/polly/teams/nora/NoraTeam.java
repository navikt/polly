package no.nav.data.polly.teams.nora;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.domain.Team;

import java.util.List;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoraTeam {

    @JsonProperty("_id")
    private String id;
    private String name;
    private String nick;
    private String groupId;
    @JsonProperty("created_at")
    private String createdAt;
    @JsonProperty("updated_at")
    private String updatedAt;
    private List<NoraMember> members;

    public Team convertToTeam() {
        return Team.builder()
                .id(nick)
                .name(name)
                .members(convert(members, NoraMember::convertToMember))
                .build();
    }
}
