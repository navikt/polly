package no.nav.data.polly.alert.domain;

import no.nav.data.polly.common.storage.domain.GenericStorage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AlertRepository extends JpaRepository<GenericStorage, UUID> {

    @Query(value = "select * from generic_storage where data ->> 'informationTypeId' = cast(?1 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    List<GenericStorage> findByInformationTypeId(UUID informationTypeId);

    @Query(value = "select * from generic_storage where data ->> 'processId' = cast(?1 as text) and data ->> 'informationTypeId' = cast(?2 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    List<GenericStorage> findByProcessIdAndInformationTypeId(UUID processId, UUID informationTypeId);

    @Query(value = "select * from generic_storage where data ->> 'processId' = cast(?1 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    List<GenericStorage> findByProcessId(UUID processId);

    @Query(value = "select * from generic_storage where data ->> 'processId' = cast(?1 as text) and data ->> 'type' = ?2 and type = 'ALERT_EVENT'", nativeQuery = true)
    Optional<GenericStorage> findByProcessIdAndEventType(UUID processId, AlertEventType eventType);

    // Deletes
    @Modifying
    @Query(value = "delete from generic_storage where data ->> 'informationTypeId' = cast(?1 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    int deleteByInformationTypeId(UUID informationTypeId);

    @Modifying
    @Query(value = "delete from generic_storage where data ->> 'processId' = cast(?1 as text) and data ->> 'informationTypeId' = cast(?2 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    int deleteByProcessIdAndInformationTypeId(UUID processId, UUID informationTypeId);

    @Modifying
    @Query(value = "delete from generic_storage where data ->> 'processId' = cast(?1 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    int deleteByProcessId(UUID processId);
}
