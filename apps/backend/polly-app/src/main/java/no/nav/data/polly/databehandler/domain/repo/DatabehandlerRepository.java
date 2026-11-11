package no.nav.data.polly.databehandler.domain.repo;

import no.nav.data.polly.databehandler.domain.Databehandler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface DatabehandlerRepository extends JpaRepository<Databehandler, UUID> {

    @Query(value = "select * from databehandler where data ->> 'navn' ilike %?1%", nativeQuery = true)
    List<Databehandler> findByNavnContaining(String navn);

    @Query(value = "select * from databehandler where data ->> 'overforingsgrunnlagUtenforEuEos' = ?1", nativeQuery = true)
    List<Databehandler> findByOverforingsgrunnlagUtenforEuEos(String overforingsgrunnlag);

}
