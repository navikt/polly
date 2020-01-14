package no.nav.data.polly.teams.nora;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.polly.teams.domain.Member;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoraMember {

    @JsonProperty("_id")
    private String id;
    private String azureId;
    private String name;
    private boolean isManager;
    private String email;

    public Member convertToMember() {
        return Member.builder().name(name).email(email).build();
    }
}
