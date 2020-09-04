package no.nav.data.polly.process.domain.repo;

import no.nav.data.polly.process.domain.DpProcess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DpProcessRepository extends JpaRepository<DpProcess, UUID> {

    @Query(value = "select * from dp_process where data ->> 'name' ilike %?1%", nativeQuery = true)
    List<DpProcess> findByNameContaining(String name);

    @Query(value = "select * from dp_process where data ->> 'name' = ?1", nativeQuery = true)
    Optional<DpProcess> findByName(String name);

}
