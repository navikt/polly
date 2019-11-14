package no.nav.data.polly.term.domain;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import no.nav.data.polly.common.auditing.Auditable;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.term.dto.TermIdNameResponse;
import no.nav.data.polly.term.dto.TermRequest;
import no.nav.data.polly.term.dto.TermResponse;
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
    @Type(type = "pg-uuid")
    @Column(name = "TERM_ID")
    private UUID id;

    @Column(name = "NAME", nullable = false, updatable = false)
    private String name;

    @Column(name = "DESCRIPTION", nullable = false)
    private String description;

    @Type(type = "jsonb-node")
    @Column(name = "DATA")
    private JsonNode data;

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

    public TermResponse convertToResponse() {
        return new TermResponse(id, name, description, data);
    }

    public TermIdNameResponse convertToIdNameResponse() {
        return new TermIdNameResponse(id, name);
    }

    public static Term convertFromNewRequest(TermRequest request) {
        return Term.builder()
                .generateId()
                .name(request.getName())
                .description(request.getDescription())
                .data(request.getData())
                .build();
    }

    public Term convertFromRequest(TermRequest request) {
        name = request.getName();
        description = request.getDescription();
        data = request.getData();
        return this;
    }

    public static class TermBuilder {

        public TermBuilder generateId() {
            id = UUID.randomUUID();
            return this;
        }
    }
}
