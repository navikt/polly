package no.nav.data.polly.policy.domain;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.legalbasis.domain.LegalBasis;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Regression test for Hypersistence JsonBinaryType deep-copy/serialization behavior.
 *
 * If JsonBinaryType cannot deep-copy (e.g. entity snapshotting for dirty checking), Hibernate may either:
 *  - throw on flush/commit (not serializable / deep copy failed), or
 *  - fail to detect nested mutations in the JSON payload.
 */
class PolicyJsonBinaryTypeIT extends IntegrationTestBase {

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    void policyData_json_roundtrip_and_nested_dirty_checking() {
        var policy = createAndSavePolicy(PURPOSE_CODE1, createAndSaveInformationType());

        // Ensure some non-trivial, nested JSON state.
        policy.getData().setPurposes(List.of(PURPOSE_CODE1, PURPOSE_CODE2));
        policy.getData().setSubjectCategories(List.of("BRUKER", "ANSATT"));
        policy.getData().setLegalBasesUse(LegalBasesUse.DEDICATED_LEGAL_BASES);
        var legalBasis = LegalBasis.builder()
                .gdpr("ART6-1-A")
                .nationalLaw("LOV-2018-01-01")
                .description("Initial description")
                .build();
        policy.getData().setLegalBases(List.of(legalBasis));
        policy.getData().setDocumentIds(List.of(UUID.randomUUID()));
        policyRepository.saveAndFlush(policy);

        // Force a new persistence context (important: dirty-check uses snapshots inside a session).
        entityManager.clear();

        var reloaded = policyRepository.findById(policy.getId()).orElseThrow();
        assertThat(reloaded.getData()).isNotNull();
        assertThat(reloaded.getData().getPurposes()).containsExactly(PURPOSE_CODE1, PURPOSE_CODE2);
        assertThat(reloaded.getData().getSubjectCategories()).containsExactly("BRUKER", "ANSATT");
        assertThat(reloaded.getData().getLegalBases()).hasSize(1);
        assertThat(reloaded.getData().getLegalBases().get(0).getDescription()).isEqualTo("Initial description");

        // Deep-copy/isolation signal: the JSON payload should be a different instance after a reload.
        assertThat(reloaded.getData()).isNotSameAs(policy.getData());

        // Keep the current timestamp so we can detect whether an UPDATE happened.
        LocalDateTime lastModifiedBefore = reloaded.getLastModifiedDate();
        assertThat(lastModifiedBefore).isNotNull();

        // Mutate deeply inside the JSON payload. This must be detected as dirty.
        reloaded.getData().getLegalBases().get(0).setDescription("Updated description");
        policyRepository.saveAndFlush(reloaded);

        entityManager.clear();
        var afterUpdate = policyRepository.findById(policy.getId()).orElseThrow();
        assertThat(afterUpdate.getData().getLegalBases().get(0).getDescription()).isEqualTo("Updated description");

        // If dirty-checking failed, we'd typically not see an UPDATE reflected in DB.
        // (We also expect LAST_MODIFIED_DATE to move forward, but DB value check is the main assertion.)
        assertThat(afterUpdate.getLastModifiedDate()).isNotNull();
        assertThat(afterUpdate.getLastModifiedDate()).isAfterOrEqualTo(lastModifiedBefore);
    }
}
