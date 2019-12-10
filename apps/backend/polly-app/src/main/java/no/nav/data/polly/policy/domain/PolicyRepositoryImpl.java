package no.nav.data.polly.policy.domain;

import org.springframework.beans.factory.annotation.Autowired;
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
public class PolicyRepositoryImpl implements PolicyRepositoryCustom {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    @Lazy
    @Autowired
    private PolicyRepository policyRepository;

    @Override
    public List<Policy> findByGDPRArticle(String gdpr) {
        var resp = jdbcTemplate.queryForList(String.format("select policy_id from policy where legal_bases @> '[{\"gdpr\": \"%s\"}]'", gdpr), new MapSqlParameterSource());
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return policyRepository.findAllById(ids);
    }

    @Override
    public List<Policy> findByNationalLaw(String nationalLaw) {
        var resp = jdbcTemplate.queryForList(String.format("select policy_id from policy where legal_bases @> '[{\"nationalLaw\": \"%s\"}]'", nationalLaw), new MapSqlParameterSource());
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return policyRepository.findAllById(ids);
    }
}
