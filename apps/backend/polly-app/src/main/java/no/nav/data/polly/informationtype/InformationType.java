package no.nav.data.polly.informationtype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.elasticsearch.ElasticsearchStatus;
import no.nav.data.polly.policy.entities.Policy;
import no.nav.data.polly.term.Term;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"term", "policies"})
@EqualsAndHashCode(callSuper = false, exclude = {"term", "policies"})
@Entity
@Table(name = "INFORMATION_TYPE")
public class InformationType extends Auditable<String> {

    @Id
    @Type(type = "pg-uuid")
    @Column(nullable = false, updatable = false)
    private UUID id;

    @NotNull
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ElasticsearchStatus elasticsearchStatus;

    @Valid
    @NotNull
    @Type(type = "jsonb")
    private InformationTypeData data;

    @ManyToOne
    @JoinColumn(name = "TERM_ID")
    private Term term;

    @Builder.Default
    @OneToMany(mappedBy = "informationType")
    private Set<Policy> policies = new HashSet<>();

    // Added outside builder to enforce backreference
    public InformationType addPolicy(Policy policy) {
        if (policy != null) {
            policies.add(policy);
            policy.setInformationType(this);
        }
        return this;
    }

    @SuppressWarnings("MismatchedQueryAndUpdateOfCollection")
    public static class InformationTypeBuilder {

        public InformationTypeBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }

}
