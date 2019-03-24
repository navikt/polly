package no.nav.data.catalog.backend.app.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubFileInfo {
    private final String name;
    private final String path;
    private final String sha;
    private final Long size;
    private final String url;
    private final String htmlUrl;
    private final String gitUrl;
    private final String downloadUrl;
    private final String type;
    private final String content;
    private final String encoding;

    @JsonCreator
    public GithubFileInfo (
            @JsonProperty("name") String name,
            @JsonProperty("path") String path,
            @JsonProperty("sha") String sha,
            @JsonProperty("size") Long size,
            @JsonProperty("url") String url,
            @JsonProperty("html_url") String htmlUrl,
            @JsonProperty("git_url") String gitUrl,
            @JsonProperty("download_url") String downloadUrl,
            @JsonProperty("type") String type,
            @JsonProperty("content") String content,
            @JsonProperty("encoding") String encoding) {
        this.name = name;
        this.path = path;
        this.sha = sha;
        this.url = url;
        this.size = size;
        this.htmlUrl = htmlUrl;
        this.gitUrl = gitUrl;
        this.downloadUrl = downloadUrl;
        this.type = type;
        this.content = content;
        this.encoding = encoding;
    }
}
