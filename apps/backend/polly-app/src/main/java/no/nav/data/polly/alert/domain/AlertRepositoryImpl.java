package no.nav.data.polly.alert.domain;

import no.nav.data.polly.common.storage.domain.GenericStorage;
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
    public Page<AlertEvent> findAlerts(UUID processId, UUID informationTypeId, AlertEventType type, AlertEventLevel level, int page, int pageSize) {
        var query = "select id , count(*) over () as count "
                + "from generic_storage "
                + "where type = 'ALERT_EVENT' ";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("page", page)
                .addValue("pageSize", pageSize);
        if (processId != null) {
            query += "and data ->> 'processId' = :processId ";
            params.addValue("processId", processId.toString());
        }
        if (informationTypeId != null) {
            query += "and data ->> 'informationTypeId' = :informationTypeId ";
            params.addValue("informationTypeId", informationTypeId.toString());
        }
        if (type != null) {
            query += "and data ->> 'type' = :type ";
            params.addValue("type", type.toString());
        }
        if (level != null) {
            query += "and data ->> 'level' = :level ";
            params.addValue("level", level.toString());
        }
        query += "order by created_date desc "
                + "limit :pageSize offset (:page * :pageSize);";

        List<Map<String, Object>> resp = jdbcTemplate.queryForList(query, params);
        long total = resp.isEmpty() ? 0 : (long) resp.get(0).get("count");
        List<AlertEvent> alertEvents = total > 0 ? get(resp) : List.of();
        return new PageImpl<>(alertEvents, PageRequest.of(page, pageSize), total);
    }

    private List<AlertEvent> get(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return alertRepository.findAllById(ids).stream()
                .sorted(Comparator.comparing(GenericStorage::getCreatedDate).reversed())
                .map(GenericStorage::toAlertEvent)
                .collect(Collectors.toList());
    }
}
