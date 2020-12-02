package no.nav.data.polly.process.domain.repo;

import no.nav.data.common.storage.domain.LastModified;
import no.nav.data.polly.process.domain.Process;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProcessRepository extends JpaRepository<Process, UUID>, ProcessRepositoryCustom {

    @Query(value = "select * from process where data #>> '{affiliation,department}' = ?1", nativeQuery = true)
    List<Process> findByDepartment(String department);

    @Query(value = "select cast(process_id as text) from process where data #>> '{affiliation,department}' = ?1", nativeQuery = true)
    List<UUID> findIdByDepartment(String department);

    @Query(value = "select * from process where data #>> '{dataProcessing,transferGroundsOutsideEU}' = ?1", nativeQuery = true)
    List<Process> findByTransferGroundsOutsideEU(String transferGrounds);

    @Query(value = "select * from process where data ->> 'commonExternalProcessResponsible' = ?1", nativeQuery = true)
    List<Process> findByCommonExternalProcessResponsible(String thirdParty);

    @Query(value = "select * from process where data -> 'number' = to_jsonb(?1)", nativeQuery = true)
    Optional<Process> findByProcessNumber(Integer number);

    @Query(value = "select * from process where data ->> 'name' ilike %?1%", nativeQuery = true)
    List<Process> findByNameContaining(String name);

    // Count

    @Query(value = "select jsonb_array_elements(data -> 'purposes') ->> 0 as code, count(p) as count from Process p group by code", nativeQuery = true)
    List<ProcessCount> countPurpose();

    @Query(value = "select data #>> '{affiliation,department}' as code, count(1) as count from process group by code", nativeQuery = true)
    List<ProcessCount> countDepartment();

    @Query(value = "select jsonb_array_elements(data #> '{affiliation,subDepartments}') ->> 0 as code, count(1) as count from process group by code", nativeQuery = true)
    List<ProcessCount> countSubDepartment();

    @Query(value = "select jsonb_array_elements(data #> '{affiliation,productTeams}') ->> 0  as code, count(1) as count from process group by code", nativeQuery = true)
    List<ProcessCount> countTeam();

    @Query(value = "select nextval('process_number')", nativeQuery = true)
    int nextProcessNumber();

    @Query("select id from Process")
    List<UUID> findAllIds();

    @Query(value = "select cast(process_id as text) as id, last_modified_by as lastModifiedBy from process where process_id in ?1", nativeQuery = true)
    List<LastModified> getLastModifiedBy(List<UUID> ids);
}
