package no.nav.data.catalog.backend.app.system;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SystemRepository extends JpaRepository<System, UUID> {
}
