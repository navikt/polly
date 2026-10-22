package no.nav.data.polly.policy.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID>, PolicyRepositoryCustom {

    List<Policy> findByInformationTypeId(UUID informationTypeId);

    List<Policy> findByProcessId(UUID processId);

    long countByInformationTypeId(UUID informationTypeId);

    /**
     * Bulk-oppdatering av denormalisert navn når en InformationType endrer navn.
     * Øker version på hver rad slik at samtidige lesere/skrivere av de samme radene
     * får optimistisk låsefeil i stedet for lost update.
     * Returnerer antall oppdaterte rader - kalleren må verifisere antallet.
     * Merk: Ingen sjekk på version her. Det forutsettes at dette gjøres på kall-stedet.
     */
    @Modifying(flushAutomatically = true)
    @Transactional(propagation = Propagation.MANDATORY)
    @Query("update Policy p set p.informationTypeName = ?2, p.version = p.version + 1 where p.informationTypeId = ?1")
    int updateInformationTypeName(UUID informationTypeId, String name);
}