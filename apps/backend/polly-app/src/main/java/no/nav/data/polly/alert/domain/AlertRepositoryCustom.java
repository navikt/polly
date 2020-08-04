package no.nav.data.polly.alert.domain;

import no.nav.data.polly.alert.AlertController.EventPage.AlertSort;
import no.nav.data.polly.alert.AlertController.EventPage.SortDir;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface AlertRepositoryCustom {

    Page<AlertEvent> findAlerts(UUID processId, UUID informationTypeId, UUID disclosureId, AlertEventType type, AlertEventLevel level, int page, int pageSize,
            AlertSort sort, SortDir dir);

}
