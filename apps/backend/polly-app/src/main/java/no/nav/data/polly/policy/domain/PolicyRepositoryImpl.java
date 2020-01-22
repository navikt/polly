package no.nav.data.polly.policy.domain;

import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
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
    public List<Policy> findBySubjectCategory(String subjectCategory) {
        var resp = jdbcTemplate.queryForList("select policy_id from policy where data #> '{subjectCategories}' ?? :subjectCategory",
                new MapSqlParameterSource().addValue("subjectCategory", subjectCategory));
        return getPolicies(resp);
    }

    @Override
    public List<Policy> findByGDPRArticle(String gdpr) {
        var resp = jdbcTemplate.queryForList("select policy_id from policy where data #> '{legalBases}' @> :gdpr::jsonb",
                new MapSqlParameterSource().addValue("gdpr", String.format("[{\"gdpr\": \"%s\"}]", gdpr)));
        return getPolicies(resp);
    }

    @Override
    public List<Policy> findByNationalLaw(String nationalLaw) {
        var resp = jdbcTemplate.queryForList("select policy_id from policy where data #> '{legalBases}' @> :nationalLaw::jsonb",
                new MapSqlParameterSource().addValue("nationalLaw", String.format("[{\"nationalLaw\": \"%s\"}]", nationalLaw)));
        return getPolicies(resp);
    }

    @Override
    public List<Policy> findByDocumentId(UUID id) {
        var resp = jdbcTemplate.queryForList("select policy_id from policy where data #> '{documentIds}' ?? :documentId",
                new MapSqlParameterSource().addValue("documentId", id.toString()));
        return getPolicies(resp);
    }

    private List<Policy> getPolicies(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return policyRepository.findAllById(ids);
    }
}
