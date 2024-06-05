package no.nav.data.common.auditing.domain;

import no.nav.data.common.storage.domain.GenericStorage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface MailLogRepository extends JpaRepository<GenericStorage, UUID> {

    @Override
    @Query(value = "select * from generic_storage where type = 'MAIL_LOG' order by created_date desc",
           countQuery = "select count(1) from generic_storage where type = 'MAIL_LOG'",
           nativeQuery = true)
    Page<GenericStorage> findAll(Pageable pageable);

    @Query(value = "select * from generic_storage where type = 'MAIL_LOG' and data ->> 'to' = ?1 order by created_date desc", nativeQuery = true)
    List<GenericStorage> findByTo(String to);
}
