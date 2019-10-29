package no.nav.data.polly.github.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubAccount {
    private final String login;

    @JsonCreator
    public GithubAccount(
            @JsonProperty("login") String login) {
        this.login = login;
    }
}
