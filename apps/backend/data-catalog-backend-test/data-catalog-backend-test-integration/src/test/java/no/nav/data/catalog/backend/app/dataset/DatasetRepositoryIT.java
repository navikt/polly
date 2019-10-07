package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelation;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DatasetRepositoryIT extends AbstractDatasetIT {

    @BeforeEach
    void setUp() throws Exception {
        saveDatasets();
    }

    @AfterEach
    void tearDown() {
        datasetRepository.deleteAll();
    }

    @Test
    void testLoad() {
        assertThat(datasetRepository.getOne(unrelated.getId()).getId()).isEqualTo(unrelated.getId());
    }

    @Test
    void testRelations() {
        var children = transactionTemplate.execute((status) -> {
            Optional<Dataset> byId = datasetRepository.findById(dataset1.getId());
            assertTrue(byId.isPresent());
            return new ArrayList<>(byId.get().getChildren());
        });
        assertThat(children).hasSize(2);

        Set<DatasetRelation> allDescendants = datasetRelationRepository.findAllDescendantsOf(dataset1.getId());
        assertThat(allDescendants).hasSize(3);
        assertThat(allDescendants).contains(
                new DatasetRelation(dataset1.getId(), dataset11.getId()),
                new DatasetRelation(dataset1.getId(), dataset12.getId()),
                new DatasetRelation(dataset11.getId(), dataset111.getId())
        );

        Set<DatasetRelation> allAncestors = datasetRelationRepository.findAllAncestorsOf(dataset111.getId());
        assertThat(allAncestors).hasSize(2);
        assertThat(allAncestors).contains(
                new DatasetRelation(dataset1.getId(), dataset11.getId()),
                new DatasetRelation(dataset11.getId(), dataset111.getId())
        );
    }

    @Test
    void findByTitle() {
        Optional<Dataset> byTitle = datasetRepository.findByTitle(dataset1.getDatasetData().getTitle());
        assertTrue(byTitle.isPresent());
        assertThat(byTitle.get()).isEqualTo(dataset1);
    }

}
