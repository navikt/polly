package no.nav.data.common.storage.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GenericStorageRepository extends JpaRepository<GenericStorage, UUID> {

    Optional<GenericStorage> findByType(StorageType type);

    List<GenericStorage> findAllByType(StorageType type);

    void deleteByType(StorageType type);
}
