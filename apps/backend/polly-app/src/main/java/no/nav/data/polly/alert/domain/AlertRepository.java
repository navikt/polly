package no.nav.data.polly.alert.domain;

import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.polly.process.domain.ProcessCount;
import no.nav.data.polly.process.domain.ProcessStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AlertRepository extends JpaRepository<GenericStorage, UUID>, AlertRepositoryCustom {

    @Query(value = "select * from generic_storage where data ->> 'informationTypeId' = cast(?1 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    List<GenericStorage> findByInformationTypeId(UUID informationTypeId);

    @Query(value = "select * from generic_storage where data ->> 'processId' = cast(?1 as text) and (data ->> 'informationTypeId' = cast(?2 as text) or data ->> 'informationTypeId' is null) and type = 'ALERT_EVENT'", nativeQuery = true)
    List<GenericStorage> findByProcessIdAndInformationTypeId(UUID processId, UUID informationTypeId);

    @Query(value = "select * from generic_storage where data ->> 'processId' = cast(?1 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    List<GenericStorage> findByProcessId(UUID processId);

    @Query(value = "select * from generic_storage where data ->> 'disclosureId' = cast(?1 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    List<GenericStorage> findByDisclosureId(UUID disclosureId);

    @Query(value = "select * from generic_storage where data ->> 'processId' = cast(?1 as text) and data ->> 'type' = ?2 and type = 'ALERT_EVENT'", nativeQuery = true)
    Optional<GenericStorage> findByProcessIdAndEventType(UUID processId, AlertEventType eventType);

    @Query(value = "select data ->> 'department' as code, count(1) as count "
            + "from process "
            + "where process_id in ( "
            + "    select cast(data ->> 'processId' as uuid) "
            + "    from generic_storage "
            + "    where type = 'ALERT_EVENT' "
            + "      and data ->> 'type' = ?1 "
            + ") "
            + "group by data ->> 'department'", nativeQuery = true)
    List<ProcessCount> countDepartmentAlertEvents(String type);


    @Query(value = "select data ->> 'department' as code, count(1) as count "
            + "from process "
            + "where process_id in ( "
            + "    select cast(data ->> 'processId' as uuid) "
            + "    from generic_storage "
            + "    where type = 'ALERT_EVENT' "
            + "      and data ->> 'type' = ?1 "
            + ") "
            + "and data ->> 'status' = ?2 "
            + "group by data ->> 'department'", nativeQuery = true)
    List<ProcessCount> countDepartmentAlertEvents(String type, ProcessStatus status);

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

    @Modifying
    @Query(value = "delete from generic_storage where data ->> 'disclosureId' = cast(?1 as text) and type = 'ALERT_EVENT'", nativeQuery = true)
    int deleteByDisclosureId(UUID disclosureId);
}
