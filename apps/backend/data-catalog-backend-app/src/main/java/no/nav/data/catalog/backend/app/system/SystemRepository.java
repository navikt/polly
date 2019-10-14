package no.nav.data.catalog.backend.app.system;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SystemRepository extends JpaRepository<System, UUID>, JpaSpecificationExecutor<System> {
    Optional<System> findByName(@Param("name") String name);

    List<System> findAllByName(List<String> name);
}
