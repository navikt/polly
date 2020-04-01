package no.nav.data.polly.informationtype;

import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.TermCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InformationTypeRepository extends JpaRepository<InformationType, UUID>, InformationTypeRepositoryCustom {

    @Query(value = "select * from information_type where data ->>'name' = ?1", nativeQuery = true)
    Optional<InformationType> findByName(String name);

    @Query(value = "select * from information_type where data ->>'sensitivity' = ?1", nativeQuery = true)
    List<InformationType> findBySensitivity(String sensitivity);

    @Query(value = "select * from information_type where data->>'navMaster' = ?1", nativeQuery = true)
    List<InformationType> findByNavMaster(String navMaster);

    @Query(value = "select * from information_type where data ->>'suggest' ilike %?1%", nativeQuery = true)
    List<InformationType> findBySuggestLike(String name);

    List<InformationType> findByTermId(String term);

    @Query(value = "select it.termId as term, count(it) as count from InformationType it group by it.termId")
    List<TermCount> countByTerm();
}
