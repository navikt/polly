package no.nav.data.polly.processor.domain.repo;

import no.nav.data.polly.processor.domain.Processor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProcessorRepository extends JpaRepository<Processor, UUID> {

    @Query(value = "select * from processor where data ->> 'name' ilike %?1%", nativeQuery = true)
    List<Processor> findByNameContaining(String name);

}
