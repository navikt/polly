package no.nav.data.polly.github.poldatasett;

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
@Table(name = "POL_DATASETT")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PolDatasett {

    public PolDatasett(String githubSha) {
        this.githubSha = githubSha;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "POL_DATASETT_ID", nullable = false, updatable = false, unique = true)
    private Long id;

    @NotNull
    @Column(name = "GITHUB_SHA", nullable = false, unique = true)
    private String githubSha;

}
