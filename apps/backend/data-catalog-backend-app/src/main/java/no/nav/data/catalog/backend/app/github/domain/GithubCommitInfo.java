package no.nav.data.catalog.backend.app.github.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubCommitInfo {
    private final List<String> added;
    private final List<String> removed;
    private final List<String> modified;

    @JsonCreator
    public GithubCommitInfo (
            @JsonProperty("added") List<String> added,
            @JsonProperty("removed") List<String> removed,
            @JsonProperty("modified") List<String> modified) {
        this.added = added;
        this.removed = removed;
        this.modified = modified;
    }
}
