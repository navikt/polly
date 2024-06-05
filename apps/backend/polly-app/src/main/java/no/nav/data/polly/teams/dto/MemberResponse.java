package no.nav.data.polly.teams.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.domain.Member;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"name", "email"})
public class MemberResponse {

    private String name;
    private String email;

    public static MemberResponse buildFrom(Member m) {
        return builder()
                .name(m.getName())
                .email(m.getEmail())
                .build();
    }

}
