package no.nav.data.polly.teams.teamcat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.domain.Member;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamKatMember {

    private String navIdent;
    private Resource resource;

    public Member convertToMember() {
        return Member.builder().name(resource.fullName).email(resource.email).build();
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Resource {

        private String fullName;
        private String email;

    }
}
