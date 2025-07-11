package no.nav.data.polly.process.dpprocess.domain.repo;

import no.nav.data.polly.process.dpprocess.domain.DpProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DpProcessRepository extends JpaRepository<DpProcess, UUID>, DpProcessRepositoryCustom {

    @Query(value = "select * from dp_process where data ->> 'name' ilike %?1%", nativeQuery = true)
    List<DpProcess> findByNameContaining(String name);

    @Query(value = "select * from dp_process where data ->> 'name' = ?1", nativeQuery = true)
    Optional<DpProcess> findByName(String name);

    @Query(value = "select * from dp_process where data #>> '{affiliation,nomDepartmentId}' = ?1", nativeQuery = true)
    List<DpProcess> findByDepartment(String department);

    @Query(value = "select * from dp_process where data ->> 'externalProcessResponsible' = ?1", nativeQuery = true)
    List<DpProcess> findByExternalProcessResponsible(String thirdParty);

    @Query(value = "select * from dp_process where data ->> 'dpProcessNumber' like %?1%", nativeQuery = true)
    Optional<List<DpProcess>> searchByDpProcessNumber(String number);

    @Query(value = "select nextval('dp_process_number')", nativeQuery = true)
    int nextDpProcessNumber();

}
