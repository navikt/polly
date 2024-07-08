package no.nav.data.polly.informationtype;

import no.nav.data.polly.codelist.CodelistStaticService;
import no.nav.data.polly.codelist.domain.ListName;
import no.nav.data.polly.informationtype.domain.InformationType;
import no.nav.data.polly.informationtype.dto.InformationTypeShortResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class InformationTypeRepositoryImpl implements InformationTypeRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final InformationTypeRepository informationTypeRepository;

    public InformationTypeRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy InformationTypeRepository informationTypeRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.informationTypeRepository = informationTypeRepository;
    }

    @Override
    public List<InformationType> findByCategory(String category) {
        var resp = jdbcTemplate.queryForList("select information_type_id from information_type where data #> '{categories}' ?? :category ",
                new MapSqlParameterSource().addValue("category", category));
        return fetch(resp);
    }

    @Override
    public List<InformationType> findBySource(String source) {
        var resp = jdbcTemplate.queryForList("select information_type_id from information_type where data #> '{sources}' ?? :source ",
                new MapSqlParameterSource().addValue("source", source));
        return fetch(resp);
    }

    @Override
    public List<InformationType> findByProductTeam(String productTeam) {
        var resp = jdbcTemplate.queryForList("select information_type_id from information_type where data #> '{productTeams}' ?? :productTeam",
                new MapSqlParameterSource().addValue("productTeam", productTeam));
        return fetch(resp);
    }


    @Override
    public List<InformationType> findByProductTeams(List<String> productTeams) {
        if (productTeams.isEmpty()) {
            return List.of();
        }
        var resp = jdbcTemplate.queryForList("select information_type_id from information_type where data #>'{productTeams}' ??| array[ :productTeams ]",
                new MapSqlParameterSource().addValue("productTeams", productTeams));
        return fetch(resp);
    }

    @Override
    public List<InformationTypeShortResponse> findAllShort() {
        return jdbcTemplate.query("select information_type_id, data->>'name', data->>'sensitivity' from information_type",
                (rs, rowNum) -> InformationTypeShortResponse.builder()
                        .id(UUID.fromString(rs.getString(1)))
                        .name(rs.getString(2))
                        .sensitivity(CodelistStaticService.getCodelistResponse(ListName.SENSITIVITY, rs.getString(3)))
                        .build());
    }

    private List<InformationType> fetch(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return informationTypeRepository.findAllById(ids);
    }
}
