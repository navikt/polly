package no.nav.data.catalog.backend.app.dataset;

import no.nav.data.catalog.backend.app.dataset.repo.DatasetRelation;
import org.junit.After;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Optional;
import java.util.Set;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

public class DatasetRepositoryIT extends AbstractDatasetIT {

    @After
    public void tearDown() {
        datasetRepository.deleteAll();
    }

    @Test
    public void testLoad() {
        assertThat(datasetRepository.getOne(unrelated.getId()).getId(), is(unrelated.getId()));
    }

    @Test
    public void testRelations() {
        var children = transactionTemplate.execute((status) -> {
            Optional<Dataset> byId = datasetRepository.findById(dataset1.getId());
            assertTrue(byId.isPresent());
            return new ArrayList<>(byId.get().getChildren());
        });
        assertThat(children, hasSize(2));

        Set<DatasetRelation> allDescendants = datasetRelationRepository.findAllDescendantsOf(dataset1.getId());
        assertThat(allDescendants, hasSize(3));
        assertThat(allDescendants, containsInAnyOrder(
                new DatasetRelation(dataset1.getId(), dataset11.getId()),
                new DatasetRelation(dataset1.getId(), dataset12.getId()),
                new DatasetRelation(dataset11.getId(), dataset111.getId())
        ));

        Set<DatasetRelation> allAncestors = datasetRelationRepository.findAllAncestorsOf(dataset111.getId());
        assertThat(allAncestors, hasSize(2));
        assertThat(allAncestors, containsInAnyOrder(
                new DatasetRelation(dataset1.getId(), dataset11.getId()),
                new DatasetRelation(dataset11.getId(), dataset111.getId())
        ));
    }

    @Test
    public void findByTitle() {
        Optional<Dataset> byTitle = datasetRepository.findByTitle(dataset1.getDatasetData().getTitle());
        assertTrue(byTitle.isPresent());
        assertThat(byTitle.get(), is(dataset1));
    }

}
