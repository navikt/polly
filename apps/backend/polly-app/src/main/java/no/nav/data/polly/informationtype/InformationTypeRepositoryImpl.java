package no.nav.data.polly.informationtype;

import no.nav.data.polly.informationtype.domain.InformationType;
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
public class InformationTypeRepositoryImpl implements InformationTypeRepositoryCustom {

    @Autowired
    private NamedParameterJdbcTemplate jdbcTemplate;

    @Lazy
    @Autowired
    private InformationTypeRepository informationTypeRepository;

    @Override
    public List<InformationType> findByCategory(String category) {
        var resp = jdbcTemplate.queryForList("select information_type_id from information_type where data #>'{categories}' ?? :category ", new MapSqlParameterSource().addValue("category", category));
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return informationTypeRepository.findAllById(ids);
    }

    @Override
    public List<InformationType> findBySource(String source) {
        var resp = jdbcTemplate.queryForList("select information_type_id from information_type where data #>'{sources}' ?? :source ", new MapSqlParameterSource().addValue("source", source));
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return informationTypeRepository.findAllById(ids);
    }
}
