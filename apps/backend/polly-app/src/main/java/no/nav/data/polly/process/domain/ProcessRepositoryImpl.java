package no.nav.data.polly.process.domain;

import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_ARTICLE_6;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_ARTICLE_9;
import static no.nav.data.polly.alert.domain.AlertEventType.MISSING_LEGAL_BASIS;

@Repository
public class ProcessRepositoryImpl implements ProcessRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ProcessRepository processRepository;

    public ProcessRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy ProcessRepository processRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.processRepository = processRepository;
    }

    @Override
    public List<Process> findByGDPRArticle(String gdpr) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{legalBases}' @> :gdpr::jsonb",
                new MapSqlParameterSource().addValue("gdpr", String.format("[{\"gdpr\": \"%s\"}]", gdpr)));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findByNationalLaw(String nationalLaw) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{legalBases}' @> :nationalLaw::jsonb",
                new MapSqlParameterSource().addValue("nationalLaw", String.format("[{\"nationalLaw\": \"%s\"}]", nationalLaw)));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findByProduct(String product) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{products}' ?? :product",
                new MapSqlParameterSource().addValue("product", product));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findBySubDepartment(String subDepartment) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{subDepartments}' ?? :subDepartment",
                new MapSqlParameterSource().addValue("subDepartment", subDepartment));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findByProductTeam(String productTeam) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{productTeams}' ?? :productTeam",
                new MapSqlParameterSource().addValue("productTeam", productTeam));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findByDocumentId(String documentId) {
        var resp = jdbcTemplate.queryForList("select distinct(process_id) from policy where data #>'{documentIds}' ?? :documentId",
                new MapSqlParameterSource().addValue("documentId", documentId));
        return getProcesses(resp);
    }

    public List<Process> findForState(ProcessField processField, ProcessState processState, String department) {
        List<Map<String, Object>> resp = queryForState(processField, processState, department);
        return getProcesses(resp);
    }

    @Override
    public long countForState(ProcessField processField, ProcessState processState, String department) {
        return queryForState(processField, processState, department).size();
    }

    private List<Map<String, Object>> queryForState(ProcessField processField, ProcessState processState, String department) {
        var alertQuery = """
                    process_id in ( 
                    select cast(data ->> 'processId' as uuid) 
                    from generic_storage 
                    where type = 'ALERT_EVENT' 
                      and data ->> 'type' = '%s' 
                )
                """;
        String query = switch (processField) {
            case ALL_INFO_TYPES -> " cast(data ->> 'usesAllInformationTypes' as boolean) = true";
            case MISSING_LEGBAS -> alertQuery.formatted(MISSING_LEGAL_BASIS);
            case MISSING_ART6 -> alertQuery.formatted(MISSING_ARTICLE_6);
            case MISSING_ART9 -> alertQuery.formatted(MISSING_ARTICLE_9);
            case DPIA, AUTOMATION, PROFILING, RETENTION -> stateQuery(processField, processState);
        };

        var sql = "select distinct(process_id) from process where " + query;

        Map<String, Object> params;
        if (department != null) {
            sql += " and data->>'department' = :department";
            params = Map.of("department", department);
        } else {
            params = Map.of();
        }
        return jdbcTemplate.queryForList(sql, params);
    }

    private String stateQuery(ProcessField processField, ProcessState processState) {
        var loc = switch (processField) {
            case DPIA -> " (data #> '{dpia,needForDpia}')";
            case PROFILING -> " (data #> '{profiling}')";
            case AUTOMATION -> " (data #> '{automaticProcessing}')";
            case RETENTION -> " (data #> '{retention,retentionPlan}')";
            case ALL_INFO_TYPES, MISSING_LEGBAS, MISSING_ART6, MISSING_ART9 -> throw new IllegalArgumentException("invalid field " + processField);
        };

        var equate = switch (processState) {
            case YES -> " = 'true'::jsonb";
            case NO -> " = 'false'::jsonb";
            case UNKNOWN -> " is null ";
        };
        return loc + equate;
    }

    private List<Process> getProcesses(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return processRepository.findAllById(ids);
    }
}
