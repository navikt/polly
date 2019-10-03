package no.nav.data.catalog.backend.app.codelist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodelistRepository extends JpaRepository<Codelist, Integer> {

    Optional<Codelist> findByListAndNormalizedCode(@Param("list") ListName list, @Param("normalizedCode") String code);

}
