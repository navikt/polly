package no.nav.data.polly.policy.domain;

import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class PolicyRepositoryImpl implements PolicyRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final PolicyRepository policyRepository;

    public PolicyRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy PolicyRepository policyRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.policyRepository = policyRepository;
    }

    @Override
    public List<Policy> findByGDPRArticle(String gdpr) {
        var resp = jdbcTemplate.queryForList("select policy_id from policy where legal_bases @> :gdpr::jsonb",
                new MapSqlParameterSource().addValue("gdpr", String.format("[{\"gdpr\": \"%s\"}]", gdpr)));
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return policyRepository.findAllById(ids);
    }

    @Override
    public List<Policy> findByNationalLaw(String nationalLaw) {
        var resp = jdbcTemplate.queryForList("select policy_id from policy where legal_bases @> :nationalLaw::jsonb",
                new MapSqlParameterSource().addValue("nationalLaw", String.format("[{\"nationalLaw\": \"%s\"}]", nationalLaw)));
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return policyRepository.findAllById(ids);
    }
}
