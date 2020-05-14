package no.nav.data.polly.alert.domain;

import org.springframework.data.domain.Page;

import java.util.UUID;

public interface AlertRepositoryCustom {

    Page<AlertEvent> findAlerts(UUID processId, UUID informationTypeId, AlertEventType type, AlertEventLevel level, int page, int pageSize);

}
