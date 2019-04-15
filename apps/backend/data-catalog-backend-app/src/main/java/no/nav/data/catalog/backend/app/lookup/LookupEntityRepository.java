package no.nav.data.catalog.backend.app.lookup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LookupEntityRepository extends JpaRepository<LookupEntity, Integer> {
	List<LookupEntity> findAllByEntity(@Param("entity") String entity);

	Optional<LookupEntity> findByEntityAndCode(@Param("entity") String entity, @Param("code") String code);
}
