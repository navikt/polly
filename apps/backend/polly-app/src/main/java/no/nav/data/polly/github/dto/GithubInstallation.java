package no.nav.data.polly.github.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GithubInstallation {

    private final String id;
    private final GithubAccount account;

    @JsonCreator
    public GithubInstallation(
            @JsonProperty("id") String id,
            @JsonProperty("account") GithubAccount account) {
        this.id = id;
        this.account = account;
    }
}
