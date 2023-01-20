package no.nav.data.polly.bigquery.queryService;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.BigQueryException;
import com.google.cloud.bigquery.BigQueryOptions;
import com.google.cloud.bigquery.Field;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.QueryParameterValue;
import com.google.cloud.bigquery.Schema;
import com.google.cloud.bigquery.TableResult;
import lombok.extern.slf4j.Slf4j;
import no.nav.data.polly.bigquery.domain.AaregAvtale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class AaregAvtaleQueryService {

    @Value("${BIGQUERY_AAREG_PROJECTID}")
    private String PROJECT_ID;

    @Value("${BIGQUERY_AAREG_DATASETNAME}")
    private String DATASET_NAME;

    @Value("${BIGQUERY_AAREG_TABLENAME}")
    private String TANLE_NAME;

    public AaregAvtale getByAvtaleId(String id) {

        String avtaleByIdQuery = "SELECT * FROM `" + PROJECT_ID + "." + DATASET_NAME + "." + TANLE_NAME + "` WHERE avtalenummer = UPPER(@avtalenummer)";

        List<AaregAvtale> aaregAvtaleList = new ArrayList<>();
        try {
            BigQuery bigquery = BigQueryOptions.getDefaultInstance().getService();
            QueryJobConfiguration queryConfig = QueryJobConfiguration
                    .newBuilder(avtaleByIdQuery)
                    .addNamedParameter("avtalenummer", QueryParameterValue.string(id))
                    .build();
            aaregAvtaleList = performQuery(bigquery, queryConfig);
        } catch (BigQueryException | InterruptedException e) {
            log.error("Query not performed \n" + e);
        }

        if (aaregAvtaleList.size() > 0) {
            return aaregAvtaleList.get(0);
        } else {
            return null;
        }
    }

    public List<AaregAvtale> searchAaregAvtale(String searchParam) {

        String avtaleByIdQuery = "SELECT * FROM `" + PROJECT_ID + "." + DATASET_NAME + "." + TANLE_NAME + "` WHERE avtalenummer LIKE UPPER(@searchParam) OR UPPER(virksomhet) LIKE UPPER(@searchParam)";

        List<AaregAvtale> aaregAvtaleList = new ArrayList<>();
        try {
            BigQuery bigquery = BigQueryOptions.getDefaultInstance().getService();
            QueryJobConfiguration queryConfig = QueryJobConfiguration
                    .newBuilder(avtaleByIdQuery)
                    .addNamedParameter("searchParam", QueryParameterValue.string("%" + searchParam + "%"))
                    .build();
            aaregAvtaleList = performQuery(bigquery, queryConfig);
        } catch (BigQueryException | InterruptedException e) {
            log.error("Query not performed \n" + e);
        }

        return aaregAvtaleList;
    }

    private List<AaregAvtale> performQuery(BigQuery bigQuery, QueryJobConfiguration queryConfig) throws InterruptedException {
        List<AaregAvtale> aaregAvtaleList = new ArrayList<>();
        TableResult results = bigQuery.query(queryConfig);
        Schema schema = results.getSchema();
        results
                .iterateAll()
                .forEach(row -> {
                    Map<String, String> mappedBiqQueryTable = new HashMap<>();
                    for (Field field : schema.getFields()) {
                        mappedBiqQueryTable.put(field.getName(), (String) row.get(field.getName()).getValue());
                    }
                    ObjectMapper mapper = new ObjectMapper();
                    aaregAvtaleList.add(mapper.convertValue(mappedBiqQueryTable, AaregAvtale.class));
                });
        log.info("Query performed successfully.");
        return aaregAvtaleList;
    }
}
