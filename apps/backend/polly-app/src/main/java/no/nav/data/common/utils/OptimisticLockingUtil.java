package no.nav.data.common.utils;

import no.nav.data.common.auditing.domain.Auditable;
import org.hibernate.Hibernate;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

/**
 * Hjelpemetoder for ekte optimistisk låsing (jakarta.persistence.Version).
 * <p>
 * Hibernate sjekker og øker versjonen automatisk ved flush av en managed entitet. Det beskytter
 * mot samtidige skrivinger innenfor samme transaksjon/flush, men ikke mot "lost update" der en
 * klient leser en rad, tenker lenge, og deretter sender inn en oppdatering basert på gamle data.
 * <p>
 * Derfor sammenlignes versjonen klienten sist leste med versjonen som ligger i basen
 * <em>før</em> DTO-en mappes over på entiteten. Versjonen settes aldri på entiteten - det ville
 * vært virkningsløst (Hibernate bruker load-snapshot) og gi lost update.
 */
public final class OptimisticLockingUtil {

    private OptimisticLockingUtil() {
    }

    /**
     * @param entity managed entitet lest fra basen
     * @param requestVersion versjonen klienten sist leste. {@code null} betyr at klienten ikke sender
     * versjon (bakoverkompatibelt); da gjelder kun Hibernate sin versjonssjekk ved flush.
     * @throws ObjectOptimisticLockingFailureException mappes til HTTP 409 i GlobalExceptionHandler
     */
    public static void checkVersion(Auditable entity, Integer requestVersion) {
        if (requestVersion == null) {
            return;
        }
        checkVersion(Hibernate.getClass(entity), HibernateUtils.getId(entity), entity.getVersion(), requestVersion);
    }

    /**
     * Variant for entiteter uten UUID-id (f.eks. Codelist med sammensatt nøkkel).
     */
    public static void checkVersion(Class<?> type, Object identifier, Integer currentVersion, Integer requestVersion) {
        if (requestVersion == null) {
            return;
        }
        if (!requestVersion.equals(currentVersion)) {
            throw new ObjectOptimisticLockingFailureException(type, identifier);
        }
    }

    /**
     * Sjekker at et @Modifying-kall traff forventet antall rader. Hvis ikke er raden(e) endret
     * eller slettet av noen andre i mellomtiden.
     */
    public static void checkRowsAffected(Class<?> type, Object identifier, int expected, int actual) {
        if (expected != actual) {
            throw new ObjectOptimisticLockingFailureException(type, identifier);
        }
    }
}
