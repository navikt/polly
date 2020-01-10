package no.nav.data.polly.document.domain;

import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class DocumentRepositoryImpl implements DocumentRepositoryCustom {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final DocumentRepository documentRepository;

    public DocumentRepositoryImpl(NamedParameterJdbcTemplate jdbcTemplate, @Lazy DocumentRepository documentRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.documentRepository = documentRepository;
    }

    @Override
    public List<Document> findByInformationTypeId(UUID informationTypeId) {
        var resp = jdbcTemplate.queryForList("select document_id from document where data #>'{informationTypeIds}' ?? :informationTypeId",
                new MapSqlParameterSource().addValue("informationTypeId", informationTypeId.toString()));
        List<UUID> ids = resp.stream().map(i -> ((UUID) i.values().iterator().next())).collect(Collectors.toList());

        return documentRepository.findAllById(ids);
    }
}
