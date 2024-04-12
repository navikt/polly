package no.nav.data.polly.disclosure.domain;

import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class DisclosureRepositoryImpl implements DisclosureRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final DisclosureRepository disclosureRepository;

    public DisclosureRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy DisclosureRepository disclosureRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.disclosureRepository = disclosureRepository;
    }

    @Override
    public List<Disclosure> findByGDPRArticle(String gdpr) {
        var resp = jdbcTemplate.queryForList("select disclosure_id from disclosure where data #>'{legalBases}' @> :gdpr::jsonb",
                new MapSqlParameterSource().addValue("gdpr", String.format("[{\"gdpr\": \"%s\"}]", gdpr)));
        return getDisclosures(resp);
    }

    @Override
    public List<Disclosure> findByNationalLaw(String nationalLaw) {
        var resp = jdbcTemplate.queryForList("select disclosure_id from disclosure where data #>'{legalBases}' @> :nationalLaw::jsonb",
                new MapSqlParameterSource().addValue("nationalLaw", String.format("[{\"nationalLaw\": \"%s\"}]", nationalLaw)));
        return getDisclosures(resp);
    }

    @Override
    public List<Disclosure> findByRecipient(String recipient) {
        var resp = jdbcTemplate.queryForList("select disclosure_id from disclosure where data #>>'{recipient}' = :recipient ",
                new MapSqlParameterSource().addValue("recipient", recipient));
        return getDisclosures(resp);
    }

    @Override
    public List<Disclosure> findByProcessId(UUID id) {
        var resp = jdbcTemplate.queryForList("select disclosure_id from disclosure where data #>'{processIds}' ?? :processId ",
                new MapSqlParameterSource().addValue("processId", id.toString()));
        return getDisclosures(resp);
    }

    @Override
    public List<Disclosure> findByInformationTypeId(UUID informationTypeId) {
        var resp = jdbcTemplate.queryForList("""
                        select disclosure_id from disclosure di 
                          where 
                            exists(select 1 from document d
                                where di.data ->> 'documentId' = d.document_id::text and  data #>'{informationTypes}' @> :informationTypeIdJson::jsonb)
                            or data #> '{informationTypeIds}' ?? :informationTypeId
                                       """,
                new MapSqlParameterSource()
                        .addValue("informationTypeIdJson", String.format("[{\"informationTypeId\": \"%s\"}]", informationTypeId))
                        .addValue("informationTypeId", informationTypeId.toString()));
        return getDisclosures(resp);
    }

    private List<Disclosure> getDisclosures(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return disclosureRepository.findAllById(ids);
    }

    @Override
    public List<Disclosure> findByProductTeam(String productTeam) {
        var resp = jdbcTemplate.queryForList("select disclosure_id from disclosure where data #>'{productTeams}' ?? :productTeam",
                new MapSqlParameterSource().addValue("productTeam", productTeam));
        return getDisclosures(resp);
    }
}
