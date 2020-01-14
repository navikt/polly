package no.nav.data.polly.teams.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.dto.MemberResponse;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Member {

    private String name;
    private String email;

    public MemberResponse convertToResponse() {
        return MemberResponse.builder().name(name).email(email).build();
    }
}
