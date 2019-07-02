package no.nav.data.catalog.backend.app.dataset;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DatasetRepository extends JpaRepository<Dataset, UUID>,
        JpaSpecificationExecutor<Dataset> {

}
