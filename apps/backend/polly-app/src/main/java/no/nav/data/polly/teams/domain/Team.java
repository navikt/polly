package no.nav.data.polly.teams.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Team {

    private String id;
    private String name;
    private String description;
    private String slackChannel;
    private String productAreaId;
    private List<String> tags;
    private List<Member> members;

}
