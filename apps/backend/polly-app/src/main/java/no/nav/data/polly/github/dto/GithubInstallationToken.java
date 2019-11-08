package no.nav.data.polly.github.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GithubInstallationToken {

    private final String token;

    @JsonCreator
    public GithubInstallationToken(
            @JsonProperty("token") String token) {
        this.token = token;
    }
}
