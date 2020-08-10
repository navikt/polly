package no.nav.data.polly.process.domain;

import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Override
    public List<Process> findForState(ProcessField processField, ProcessState processState, String department, ProcessStatus status) {
        List<Map<String, Object>> resp = queryForState(processField, processState, department, status);
        return getProcesses(resp);
    }

    @Override
    public long countForState(ProcessField processField, ProcessState processState, String department, ProcessStatus status) {
        return queryForState(processField, processState, department, status).size();
    }

    private List<Map<String, Object>> queryForState(ProcessField processField, ProcessState processState, String department, ProcessStatus status) {
        var alertQuery = """
                     process_id in ( 
                     select cast(data ->> 'processId' as uuid) 
                     from generic_storage 
                     where type = 'ALERT_EVENT' 
                       and data ->> 'type' = '%s' 
                 )
                """;
        String query;
        if (processField.alertEvent) {
            query = alertQuery.formatted(processField);
        } else {
            query = stateQuery(processField, processState);
        }

        var sql = "select distinct(process_id) from process where " + query;

        Map<String, Object> params = new HashMap<>();
        if (department != null) {
            sql += " and data->>'department' = :department";
            params.put("department", department);
        }
        if (status != null) {
            sql += " and data->>'status' = :status";
            params.put("status", status);
        }
        return jdbcTemplate.queryForList(sql, params);
    }

    private String stateQuery(ProcessField processField, ProcessState processState) {
        var loc = switch (processField) {
            case DPIA -> " data #> '{dpia,needForDpia}' %s ";
            case PROFILING -> " data #> '{profiling}' %s ";
            case AUTOMATION -> " data #> '{automaticProcessing}' %s ";
            case RETENTION -> " data #> '{retention,retentionPlan}' %s ";
            case RETENTION_DATA -> " data #> '{retention,retentionStart}' %1$s or data #> '{retention,retentionMonths}' %1$s ";
            case DATA_PROCESSOR -> " data #> '{dataProcessing,dataProcessor}' %s ";
            case DATA_PROCESSOR_OUTSIDE_EU -> " data #> '{dataProcessing,dataProcessor}' = 'true'::jsonb and data #> '{dataProcessing,dataProcessorOutsideEU}' %s ";

            // UNKNOWN counts empty, YES/NO doesnt make sense and will always return false
            case DATA_PROCESSOR_AGREEMENT_EMPTY -> {
                processState = ProcessState.UNKNOWN;
                yield " data #> '{dataProcessing,dataProcessor}' = 'true'::jsonb and data #> '{dataProcessing,dataProcessorAgreements}' %s ";
            }
            default -> throw new IllegalArgumentException("invalid field for stateQuery " + processField);
        };

        var equate = switch (processState) {
            case YES -> " = 'true'::jsonb";
            case NO -> " = 'false'::jsonb";
            // '->> 0' forces jsonb null to sql null, also helps on array length lookups
            case UNKNOWN -> " ->> 0 is null ";
        };
        return "(" + loc.formatted(equate) + ")";
    }

    private List<Process> getProcesses(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return processRepository.findAllById(ids);
    }
}
