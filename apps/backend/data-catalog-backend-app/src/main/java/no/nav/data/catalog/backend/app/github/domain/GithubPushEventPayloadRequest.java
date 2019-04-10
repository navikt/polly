package no.nav.data.catalog.backend.app.github.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubPushEventPayloadRequest {
    private final List<GithubCommitInfo>  githubCommitList;

    @JsonCreator
    public GithubPushEventPayloadRequest (
            @JsonProperty("commits") List<GithubCommitInfo> githubCommitList) {
        this.githubCommitList = githubCommitList;
    }

}
