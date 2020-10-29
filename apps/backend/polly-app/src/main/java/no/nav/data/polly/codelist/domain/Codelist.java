package no.nav.data.polly.codelist.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import no.nav.data.common.auditing.domain.Auditable;
import no.nav.data.polly.codelist.dto.CodelistResponse;
import org.apache.commons.lang3.NotImplementedException;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table(name = "CODELIST")
@Data
@Builder
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@IdClass(Codelist.IdClass.class)
public class Codelist extends Auditable {

    @Id
    @Column(name = "LIST_NAME")
    @Enumerated(EnumType.STRING)
    private ListName list;

    @Id
    @Column(name = "CODE")
    private String code;

    @Column(name = "SHORT_NAME")
    private String shortName;

    @Column(name = "DESCRIPTION")
    private String description;

    public CodelistResponse convertToResponse() {
        return CodelistResponse.builder()
                .list(list)
                .code(code)
                .shortName(shortName)
                .description(description)
                .build();
    }

    @Override
    public UUID getId() {
        throw new NotImplementedException("does not apply");
    }

    @Data
    static class IdClass implements Serializable {

        private ListName list;
        private String code;

    }

}
