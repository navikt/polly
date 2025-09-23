package no.nav.data.polly.process.domain.repo;

import lombok.extern.slf4j.Slf4j;
import no.nav.data.common.utils.StreamUtils;
import no.nav.data.polly.process.domain.Process;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessField;
import no.nav.data.polly.process.dto.ProcessStateRequest.ProcessState;
import no.nav.data.polly.process.dto.StateDbRequest;
import org.springframework.context.annotation.Lazy;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Repository
public class ProcessRepositoryImpl implements ProcessRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ProcessRepository processRepository;

    public ProcessRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy ProcessRepository processRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.processRepository = processRepository;
    }

    @Override
    public Optional<Process> findByNameAndPurposes(String name, List<String> purposes) {
        try {
            UUID resp = jdbcTemplate.queryForObject(
                    "select process_id from process where data #>'{purposes}' ??& array [ :purposes ] and jsonb_array_length(data #>'{purposes}') = :purposesLength and data ->> 'name' = :name",
                    new MapSqlParameterSource()
                            .addValue("purposes", purposes)
                            .addValue("purposesLength", purposes.size())
                            .addValue("name", name), UUID.class);
            return processRepository.findById(resp);
        } catch (DataAccessException e) {
            log.trace("no process for name and purpose", e);
            return Optional.empty();
        }
    }

    @Override
    public List<Process> findByPurpose(String purpose) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{purposes}' ?? :purpose",
                new MapSqlParameterSource().addValue("purpose", purpose));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findByProcessor(UUID processor) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{dataProcessing,processors}' ?? :processor::text",
                new MapSqlParameterSource().addValue("processor", processor));
        return getProcesses(resp);
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
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{affiliation,products}' ?? :product",
                new MapSqlParameterSource().addValue("product", product));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findBySubDepartment(String subDepartment) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{affiliation,subDepartments}' ?? :subDepartment",
                new MapSqlParameterSource().addValue("subDepartment", subDepartment));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findByProductTeam(String productTeam) {
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{affiliation,productTeams}' ?? :productTeam",
                new MapSqlParameterSource().addValue("productTeam", productTeam));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findByProductTeams(List<String> productTeams) {
        if (productTeams.isEmpty()) {
            return List.of();
        }
        var resp = jdbcTemplate.queryForList("select process_id from process where data #>'{affiliation,productTeams}' ??| array[ :productTeams ]",
                new MapSqlParameterSource().addValue("productTeams", productTeams));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findByDocumentId(UUID documentId) {
        var resp = jdbcTemplate.queryForList("select distinct(process_id) from policy where data #>'{documentIds}' ?? :documentId",
                new MapSqlParameterSource().addValue("documentId", documentId.toString()));
        return getProcesses(resp);
    }

    @Override
    public List<Process> findForState(StateDbRequest stateDbRequest) {
        List<Map<String, Object>> resp = queryForState(stateDbRequest);
        return getProcesses(resp);
    }

    private List<Map<String, Object>> queryForState(StateDbRequest stateDbRequest) {
        var alertQuery = """
                     process_id in ( 
                     select cast(data ->> 'processId' as uuid) 
                     from generic_storage 
                     where type = 'ALERT_EVENT' 
                       and data ->> 'type' = '%s' 
                 )
                """;
        String query;
        if (stateDbRequest.getProcessField().alertEvent) {
            query = alertQuery.formatted(stateDbRequest.getProcessField());
        } else {
            query = stateQuery(stateDbRequest.getProcessField(), stateDbRequest.getProcessState());
        }

        var sql = "select distinct(process_id) from process where " + query;

        Map<String, Object> params = new HashMap<>();
        if (stateDbRequest.getDepartment() != null) {
            sql += " and data #>> '{affiliation,nomDepartmentId}' = :department";
            params.put("department", stateDbRequest.getDepartment());
        }
        if (stateDbRequest.getTeamIds() != null) {
            sql += " and data #> '{affiliation,productTeams}' ??| array[ :productTeams ]";
            params.put("productTeams", stateDbRequest.getTeamIds());
        }
        if (stateDbRequest.getStatus() != null) {
            sql += " and data ->> 'status' = :status";
            params.put("status", stateDbRequest.getStatus().name());
        }
        return jdbcTemplate.queryForList(sql, params);
    }

    private String stateQuery(ProcessField processField, ProcessState processState) {
        if (processField == ProcessField.COMMON_EXTERNAL_PROCESSOR) {
            String query = " data #> '{commonExternalProcessResponsible}' ";
            return processState == ProcessState.YES ? query + "->> 0 is not null " : query + "->> 0 is null ";
        }

        var loc = switch (processField) {
            case DPIA -> " data #> '{dpia,needForDpia}' %s ";
            case PROFILING -> " data #> '{profiling}' %s ";
            case AIUSAGE -> " data #> '{aiUsageDescription,aiUsage}' %s ";
            case AUTOMATION -> " data #> '{automaticProcessing}' %s ";
            case RETENTION -> " data #> '{retention,retentionPlan}' %s ";
            case RETENTION_DATA -> " data #> '{retention,retentionStart}' %1$s or data #> '{retention,retentionMonths}' %1$s ";
            case DATA_PROCESSOR -> " data #> '{dataProcessing,dataProcessor}' %s ";

            // UNKNOWN counts empty, YES/NO doesnt make sense and will always return false
            case DPIA_REFERENCE_MISSING -> {
                processState = ProcessState.UNKNOWN;
                yield " data #> '{dpia,needForDpia}' = 'true'::jsonb and data #> '{dpia,refToDpia}' %s ";
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
        return processRepository.findAllById(StreamUtils.convert(resp, i -> (UUID) i.values().iterator().next()));
    }
}
