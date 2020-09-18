package no.nav.data.polly.process.domain.repo;

import no.nav.data.polly.process.domain.DpProcess;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class DpProcessRepositoryImpl implements DpProcessRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final DpProcessRepository processRepository;

    public DpProcessRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy DpProcessRepository processRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.processRepository = processRepository;
    }

    @Override
    public List<DpProcess> findByProduct(String product) {
        var resp = jdbcTemplate.queryForList("select dp_process_id from dp_process where data #>'{affiliation,products}' ?? :product",
                new MapSqlParameterSource().addValue("product", product));
        return getDpProcesses(resp);
    }

    @Override
    public List<DpProcess> findBySubDepartment(String subDepartment) {
        var resp = jdbcTemplate.queryForList("select dp_process_id from dp_process where data #>'{affiliation,subDepartments}' ?? :subDepartment",
                new MapSqlParameterSource().addValue("subDepartment", subDepartment));
        return getDpProcesses(resp);
    }

    @Override
    public List<DpProcess> findByProductTeam(String productTeam) {
        var resp = jdbcTemplate.queryForList("select dp_process_id from dp_process where data #>'{affiliation,productTeams}' ?? :productTeam",
                new MapSqlParameterSource().addValue("productTeam", productTeam));
        return getDpProcesses(resp);
    }

    @Override
    public List<DpProcess> findByProductTeams(List<String> productTeams) {
        if (productTeams.isEmpty()) {
            return List.of();
        }
        var resp = jdbcTemplate.queryForList("select dp_process_id from dp_process where data #>'{affiliation,productTeams}' ??| array[ :productTeams ]",
                new MapSqlParameterSource().addValue("productTeams", productTeams));
        return getDpProcesses(resp);
    }

    private List<DpProcess> getDpProcesses(List<Map<String, Object>> resp) {
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());
        return processRepository.findAllById(ids);
    }
}
