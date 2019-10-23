package no.nav.data.polly.term;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.informationtype.InformationType;
import org.hibernate.annotations.Type;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "informationTypes")
@EqualsAndHashCode(callSuper = false, exclude = "informationTypes")
@Entity
@Table(name = "TERM")
public class Term extends Auditable<String> {

    @Id
    @Column(name = "INFORMATION_TYPE_ID")
    @Type(type = "pg-uuid")
    private UUID id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Builder.Default
    @OneToMany(mappedBy = "term")
    private Set<InformationType> informationTypes = new HashSet<>();

    // Added outside builder to enforce backreference
    public Term addInformationType(InformationType informationType) {
        if (informationType != null) {
            informationTypes.add(informationType);
            informationType.setTerm(this);
        }
        return this;
    }

    public static class TermBuilder {

        public TermBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }
}
