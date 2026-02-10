package no.nav.data.polly.policy.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.legalbasis.domain.LegalBasis;

import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PolicyData implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @NotNull
    @Singular
    private List<String> purposes;
    @NotNull
    @Singular
    private List<String> subjectCategories;
    @Builder.Default
    private boolean legalBasesInherited = false;
    @NotNull
    private LegalBasesUse legalBasesUse;
    @Valid
    @NotNull
    @Singular("legalBasis")
    private List<LegalBasis> legalBases;
    @Builder.Default
    private List<UUID> documentIds = new ArrayList<>();

    public void setDocumentIds(List<UUID> documentIds) {
        this.documentIds = documentIds == null ? new ArrayList<>() : new ArrayList<>(documentIds);
    }

    public static class PolicyDataBuilder {
        public PolicyDataBuilder documentIds(List<UUID> documentIds) {
            this.documentIds$value = documentIds == null ? new ArrayList<>() : new ArrayList<>(documentIds);
            this.documentIds$set = true;
            return this;
        }
    }
}
