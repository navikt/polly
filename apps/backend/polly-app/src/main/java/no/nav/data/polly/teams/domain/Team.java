package no.nav.data.polly.teams.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.dto.TeamResponse;

import java.util.List;

import static no.nav.data.polly.common.utils.StreamUtils.convert;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Team {

    private String id;
    private String name;
    private String description;
    private List<Member> members;

    public TeamResponse convertToResponse() {
        return TeamResponse.builder()
                .id(id)
                .name(name)
                .members(convert(members, Member::convertToResponse))
                .build();
    }
}
