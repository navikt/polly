package no.nav.data.polly.informationtype;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.common.auditing.Auditable;
import org.hibernate.annotations.Type;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "contexts")
@EqualsAndHashCode(callSuper = false, exclude = "contexts")
@Entity
@Table(name = "INFORMATION_TYPE")
public class InformationType extends Auditable<String> {

    @Id
    @Column(name = "INFORMATION_TYPE_ID")
    @Type(type = "pg-uuid")
    private UUID id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Type(type = "json")
    @Column(name = "CATEGORIES")
    private List<String> categories = new ArrayList<>();

    @Column(name = "PII")
    private String pii;

    @Column(name = "SENSITIVITY")
    private String sensitivity;

    @Builder.Default
    @OneToMany(mappedBy = "informationType", fetch = FetchType.EAGER, orphanRemoval = true, cascade = CascadeType.ALL)
    private Set<Context> contexts = new HashSet<>();

    // Added outside builder to enforce backreference
    public InformationType addContext(Context context) {
        if (context != null) {
            contexts.add(context);
            context.setInformationType(this);
        }
        return this;
    }

    public static class InformationTypeBuilder {

        private List<String> categories = new ArrayList<>();

        public InformationTypeBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }

        public InformationTypeBuilder category(String category) {
            categories.add(category);
            return this;
        }
    }

}
