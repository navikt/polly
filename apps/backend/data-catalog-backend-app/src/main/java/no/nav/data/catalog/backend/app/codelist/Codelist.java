package no.nav.data.catalog.backend.app.codelist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import no.nav.data.catalog.backend.app.common.auditing.Auditable;

import java.io.Serializable;
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
@NoArgsConstructor
@AllArgsConstructor
@IdClass(Codelist.IdClass.class)
public class Codelist extends Auditable<String> {

    @Id
    @Column(name = "LIST_NAME")
    @Enumerated(EnumType.STRING)
    private ListName list;

    @Id
    @Column(name = "CODE")
    private String code;

    @Column(name = "NORMALIZED_CODE")
    private String normalizedCode;

    @Column(name = "DESCRIPTION")
    private String description;

    @Data
    static class IdClass implements Serializable {

        private ListName list;
        private String code;
    }

    public static String normalize(String code) {
        return code == null ? null : code.toUpperCase().replaceAll("[^A-ZÆØÅ0-9]*", "");
    }

    public static class CodelistBuilder {

        public CodelistBuilder code(String code) {
            this.code = code;
            this.normalizedCode = Codelist.normalize(code);
            return this;
        }
    }
}
