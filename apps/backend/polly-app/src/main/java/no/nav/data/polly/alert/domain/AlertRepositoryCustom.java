package no.nav.data.polly.alert.domain;

import no.nav.data.polly.alert.domain.AlertRepositoryImpl.AlertEventRequest;
import org.springframework.data.domain.Page;

public interface AlertRepositoryCustom {

    Page<AlertEvent> findAlerts(AlertEventRequest request);

}
