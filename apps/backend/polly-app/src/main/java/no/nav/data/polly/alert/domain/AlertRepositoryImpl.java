package no.nav.data.polly.alert.domain;

import no.nav.data.common.storage.domain.GenericStorage;
import no.nav.data.polly.alert.AlertController.EventPage.AlertSort;
import no.nav.data.polly.alert.AlertController.EventPage.SortDir;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class AlertRepositoryImpl implements AlertRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final AlertRepository alertRepository;

    public AlertRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy AlertRepository alertRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.alertRepository = alertRepository;
    }

    @Override
    public Page<AlertEvent> findAlerts(AlertEventRequest request) {
        var query = """
                select id , count(*) over () as count
                from generic_storage gs
                where type = 'ALERT_EVENT'
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("page", request.page())
                .addValue("pageSize", request.pageSize());
        if (request.processId() != null) {
            query += "and data ->> 'processId' = :processId ";
            params.addValue("processId", request.processId().toString());
        }
        if (request.informationTypeId() != null) {
            query += "and data ->> 'informationTypeId' = :informationTypeId ";
            params.addValue("informationTypeId", request.informationTypeId().toString());
        }
        if (request.disclosureId() != null) {
            query += "and data ->> 'disclosureId' = :disclosureId ";
            params.addValue("disclosureId", request.disclosureId().toString());
        }
        if (request.type() != null) {
            query += "and data ->> 'type' = :type ";
            params.addValue("type", request.type().toString());
        }
        if (request.level() != null) {
            query += "and data ->> 'level' = :level ";
            params.addValue("level", request.level().toString());
        }
        query += "order by " + order(request.sort(), request.dir()) + " limit :pageSize offset (:page * :pageSize)";

        List<Map<String, Object>> resp = jdbcTemplate.queryForList(query, params);
        long total = resp.isEmpty() ? 0 : (long) resp.get(0).get("count");
        List<AlertEvent> alertEvents = total > 0 ? get(resp) : List.of();
        return new PageImpl<>(alertEvents, PageRequest.of(request.page(), request.pageSize()), total);
    }

    private String order(AlertSort sort, SortDir dir) {
        if (sort == null) {
            return "created_date desc";
        }
        var dirSql = dir != null ? switch (dir) {
            case ASC -> " asc";
            case DESC -> " desc";
        } : " desc";
        return switch (sort) {
            case PROCESS -> "(select data ->> 'name' from process p where p.process_id = cast(gs.data ->>'processId' as uuid))";
            case INFORMATION_TYPE -> "(select it.data ->> 'name' from information_type it where it.information_type_id = cast(gs.data ->>'informationTypeId' as uuid))";
            case DISCLOSURE -> "(select d.data ->> 'name' from disclosure d where d.disclosure_id = cast(gs.data ->>'disclosureId' as uuid))";
            case TYPE -> "data ->> 'type'";
            case LEVEL -> "data ->> 'level'";
            case TIME -> "created_date";
            case USER -> "created_by";
        } + dirSql;
    }

    private List<AlertEvent> get(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return alertRepository.findAllById(ids).stream()
                .sorted(Comparator.comparing(GenericStorage::getCreatedDate).reversed())
                .map(GenericStorage::toAlertEvent)
                .collect(Collectors.toList());
    }

    public record AlertEventRequest(
            UUID processId, UUID informationTypeId, UUID disclosureId,
            AlertEventType type, AlertEventLevel level,
            int page, int pageSize, AlertSort sort, SortDir dir
    ) {
    }

}
