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
    private String name;
    private String email;

    public Member convertToMember() {
        return Member.builder().name(name).email(email).build();
    }
}
