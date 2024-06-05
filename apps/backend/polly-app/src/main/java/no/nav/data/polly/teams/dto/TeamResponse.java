package no.nav.data.polly.teams.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.domain.Team;

import java.util.List;

import static no.nav.data.common.utils.StreamUtils.convert;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"id", "name", "description", "slackChannel", "productAreaId", "tags", "members"})
public class TeamResponse {

    private String id;
    private String name;
    private String description;
    private String slackChannel;
    private String productAreaId;
    private List<String> tags;
    private List<MemberResponse> members;

    public static TeamResponse buildFrom(Team t) {
        return builder()
                .id(t.getId())
                .name(t.getName())
                .description(t.getDescription())
                .slackChannel(t.getSlackChannel())
                .productAreaId(t.getProductAreaId())
                .tags(t.getTags())
                .build();
    }

    public static TeamResponse buildFromWithMembers(Team t) {
        var resp = buildFrom(t);
        resp.setMembers(convert(t.getMembers(), MemberResponse::buildFrom));
        return resp;
    }

}
