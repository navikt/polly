package no.nav.data.catalog.backend.app.poldatasett;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;

@Entity
@Data
@NoArgsConstructor
@Table(name = "POL_DATASETT", schema = "BACKEND_SCHEMA")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PolDatasett extends Auditable<String> {

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
