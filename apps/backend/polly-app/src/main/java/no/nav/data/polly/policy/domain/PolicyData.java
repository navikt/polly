package no.nav.data.polly.policy.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;
import no.nav.data.polly.legalbasis.domain.LegalBasis;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PolicyData {

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
    @Singular
    private List<UUID> documentIds;
}
