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

    @Query(value = "select * from process where data->>'productTeam' = ?1", nativeQuery = true)
    List<Process> findByProductTeam(String productTeam);

    @Query(value = "select * from process where name ilike %?1%", nativeQuery = true)
    List<Process> findByNameContaining(String name);

    @Query(value = "select p.purposeCode as purposeCode, count(p) as count from Process p group by p.purposeCode")
    List<PurposeCount> countByPurposeCode();
}
