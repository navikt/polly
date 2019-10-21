package no.nav.data.polly.github.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubInstallationToken {
    private final String token;

    @JsonCreator
    public GithubInstallationToken(
            @JsonProperty("token") String token) {
        this.token = token;
    }
}
