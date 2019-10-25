package no.nav.data.polly.github.status;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Data
@NoArgsConstructor
@Table(name = "GITHUB_STATUS")
@JsonIgnoreProperties(ignoreUnknown = true)
public class GithubStatus {

    public GithubStatus(String githubSha) {
        this.githubSha = githubSha;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "GITHUB_STATUS_ID", nullable = false, updatable = false, unique = true)
    private Long id;

    @NotNull
    @Column(name = "GITHUB_SHA", nullable = false, unique = true)
    private String githubSha;

}
