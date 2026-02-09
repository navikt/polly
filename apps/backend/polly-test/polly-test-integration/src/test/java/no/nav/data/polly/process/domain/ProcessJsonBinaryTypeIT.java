package no.nav.data.polly.process.domain;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import no.nav.data.polly.IntegrationTestBase;
import no.nav.data.polly.process.domain.sub.Affiliation;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Regression test for Hypersistence JsonBinaryType deep-copy/serialization behavior.
 *
 * If JsonBinaryType cannot deep-copy (e.g. entity snapshotting for dirty checking), Hibernate may either:
 *  - throw on flush/commit (not serializable / deep copy failed), or
 *  - fail to detect nested mutations in the JSON payload.
 */
class ProcessJsonBinaryTypeIT extends IntegrationTestBase {

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    void processData_json_roundtrip_and_nested_dirty_checking() {
        var process = createAndSaveProcess(PURPOSE_CODE1);

        // Ensure some non-trivial, nested JSON state.
        process.getData().setPurposes(List.of(PURPOSE_CODE1, PURPOSE_CODE2));
        process.getData().setDescription("desc");
        process.getData().setAdditionalDescription("more");
        process.getData().setAffiliation(new Affiliation());
        process.getData().getAffiliation().setDepartment("DEP-A");
        processRepository.saveAndFlush(process);

        // Force a new persistence context (important: dirty-check uses snapshots inside a session).
        entityManager.clear();

        var reloaded = processRepository.findById(process.getId()).orElseThrow();
        assertThat(reloaded.getData()).isNotNull();
        assertThat(reloaded.getData().getPurposes()).containsExactly(PURPOSE_CODE1, PURPOSE_CODE2);
        assertThat(reloaded.getData().getAffiliation().getDepartment()).isEqualTo("DEP-A");

        // Deep-copy/isolation signal: the JSON payload should be a different instance after a reload.
        assertThat(reloaded.getData()).isNotSameAs(process.getData());

        // Keep the current timestamp so we can detect whether an UPDATE happened.
        LocalDateTime lastModifiedBefore = reloaded.getLastModifiedDate();
        assertThat(lastModifiedBefore).isNotNull();

        // Mutate deeply inside the JSON payload. This must be detected as dirty.
        reloaded.getData().getAffiliation().setDepartment("DEP-B");
        processRepository.saveAndFlush(reloaded);

        entityManager.clear();
        var afterUpdate = processRepository.findById(process.getId()).orElseThrow();
        assertThat(afterUpdate.getData().getAffiliation().getDepartment()).isEqualTo("DEP-B");

        // If dirty-checking failed, we'd typically not see an UPDATE reflected in DB.
        // (We also expect LAST_MODIFIED_DATE to move forward, but DB value check is the main assertion.)
        assertThat(afterUpdate.getLastModifiedDate()).isNotNull();
        assertThat(afterUpdate.getLastModifiedDate()).isAfterOrEqualTo(lastModifiedBefore);
    }
}
