package no.nav.polly.github;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class GithubReference {

    private String title;
    private String path;
    private Integer ordinal;

    @Override
    public String toString() {
        return String.format("title=%s path=%s ordinal=%d", title, path, ordinal);
    }
}
