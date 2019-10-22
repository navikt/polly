package no.nav.data.polly.informationtype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import org.hibernate.annotations.Type;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "informationType")
@EqualsAndHashCode(callSuper = false, exclude = "informationType")
@Entity
@Table(name = "CONTEXT")
public class Context extends Auditable<String> {

    @Id
    @Column(name = "CONTEXT_ID")
    @Type(type = "pg-uuid")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "INFORMATION_TYPE_ID")
    private InformationType informationType;

    @NotNull
    @Column(name = "ELASTICSEARCH_STATUS", nullable = false)
    @Enumerated(EnumType.STRING)
    private ElasticsearchStatus elasticsearchStatus;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Type(type = "json")
    @Column(name = "SOURCES")
    private List<String> sources = new ArrayList<>();

    @Type(type = "json")
    @Column(name = "KEYWORDS")
    private List<String> keywords = new ArrayList<>();

    public static class ContextBuilder {

        private List<String> sources = new ArrayList<>();
        private List<String> keywords = new ArrayList<>();

        public ContextBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

        public ContextBuilder source(String source) {
            sources.add(source);
            return this;
        }

        public ContextBuilder keyword(String keyword) {
            keywords.add(keyword);
            return this;
        }
    }
}
