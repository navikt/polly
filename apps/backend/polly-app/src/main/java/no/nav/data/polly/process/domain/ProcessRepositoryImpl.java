package no.nav.data.polly.process.domain;

import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class ProcessRepositoryImpl implements ProcessRepositoryCustom {

    private NamedParameterJdbcTemplate jdbcTemplate;
    private ProcessRepository processRepository;


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

    private List<Process> getProcesses(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return processRepository.findAllById(ids);
    }
}
