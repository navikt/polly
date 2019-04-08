package no.nav.data.catalog.backend.app.github.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubInstallation {
    private final String id;
    private final GithubAccount account;

    @JsonCreator
    public GithubInstallation (
            @JsonProperty("id") String id,
            @JsonProperty("account") GithubAccount account) {
        this.id = id;
        this.account = account;
    }
}
