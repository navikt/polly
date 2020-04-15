package no.nav.data.polly.process.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProcessRepository extends JpaRepository<Process, UUID>, ProcessRepositoryCustom {

    Optional<Process> findByNameAndPurposeCode(String name, String purposeCode);

    List<Process> findByPurposeCode(String purpose);

    @Query(value = "select * from process where data->>'department' = ?1", nativeQuery = true)
    List<Process> findByDepartment(String department);

    @Query(value = "select * from process where data->>'subDepartment' = ?1", nativeQuery = true)
    List<Process> findBySubDepartment(String subDepartment);

    @Query(value = "select * from process where data->>'commonExternalProcessResponsible' = ?1", nativeQuery = true)
    List<Process> findByCommonExternalProcessResponsible(String thirdParty);

    @Query(value = "select * from process where data->>'productTeam' = ?1", nativeQuery = true)
    List<Process> findByProductTeam(String productTeam);

    @Query(value = "select * from process where name ilike %?1%", nativeQuery = true)
    List<Process> findByNameContaining(String name);

    // Count

    @Query(value = "select count(1) from process where data->>'status' = cast(?1 as text) ", nativeQuery = true)
    long countStatus(ProcessStatus status);

    @Query(value = "select count(1) from process where cast(data ->> 'usesAllInformationTypes' as boolean) = true", nativeQuery = true)
    long countUsingAllInfoTypes();

    @Query(value = "select count(1) from process where cast (data -> 'dpia' ->> 'needForDpia' as boolean) = true", nativeQuery = true)
    long countWithDpia();

    @Query(value = "select count(1) from process where data #> '{dpia,needForDpia}' is null", nativeQuery = true)
    long countUnknownDpia();

    @Query(value = "select p.purposeCode as code, count(p) as count from Process p group by p.purposeCode")
    List<ProcessCount> countPurposeCode();

    @Query(value = "select data->>'department' as code, count(1) as count from process group by data->>'department'", nativeQuery = true)
    List<ProcessCount> countDepartmentCode();

    @Query(value = "select data->>'subDepartment' as code, count(1) as count from process group by data->>'subDepartment'", nativeQuery = true)
    List<ProcessCount> countSubDepartmentCode();

    @Query(value = "select data->>'productTeam' as code, count(1) as count from process group by data->>'productTeam'", nativeQuery = true)
    List<ProcessCount> countTeam();

    @Query(value = "select data->>'department' as code, count(1) as count from process where data->>'status' = cast(?1 as text) group by data->>'department'", nativeQuery = true)
    List<ProcessCount> countDepartmentCodeStatus(ProcessStatus status);
}
