package no.nav.data.polly.informationtype;

import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.domain.TermCount;
import no.nav.data.polly.sync.domain.SyncStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

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

    List<InformationType> findBySyncStatus(SyncStatus status);

    @Modifying
    @Transactional
    @Query("update InformationType set syncStatus = 'TO_BE_UPDATED' where id in ?1")
    int setSyncForInformationTypeIds(List<UUID> ids);

    List<InformationType> findByTermId(String term);

    @Query(value = "select it.termId as term, count(it) as count from InformationType it group by it.termId")
    List<TermCount> countByTerm();
}
