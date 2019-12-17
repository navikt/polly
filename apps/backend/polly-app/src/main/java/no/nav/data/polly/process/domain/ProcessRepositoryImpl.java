package no.nav.data.polly.process.domain;

import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@Transactional(readOnly = true)
public class ProcessRepositoryImpl implements ProcessRepositoryCustom {

    private NamedParameterJdbcTemplate jdbcTemplate;
    private ProcessRepository processRepository;


    public ProcessRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy ProcessRepository processRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.processRepository = processRepository;
    }

    @Override
    public List<Process> findByGDPRArticle(String gdpr) {
        var resp = jdbcTemplate.queryForList(String.format("select process_id from process where data #>'{legalBases}' @> '[{\"gdpr\": \"%s\"}]'", gdpr), new MapSqlParameterSource());
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return processRepository.findAllById(ids);
    }

    @Override
    public List<Process> findByNationalLaw(String nationalLaw) {
        var resp = jdbcTemplate.queryForList(String.format("select process_id from process where data #>'{legalBases}' @> '[{\"nationalLaw\": \"%s\"}]'", nationalLaw), new MapSqlParameterSource());
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return processRepository.findAllById(ids);
    }
}
