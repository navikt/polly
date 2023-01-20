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

        String avtaleByIdQuery = "SELECT * FROM `"  + PROJECT_ID + "." + DATASET_NAME + "." + TANLE_NAME + "` WHERE avtalenummer = @avtalenummer";

        List<AaregAvtale> aaregAvtaleList = new ArrayList<>();
        try {
            BigQuery bigquery = BigQueryOptions.getDefaultInstance().getService();
            QueryJobConfiguration queryConfig = QueryJobConfiguration
                    .newBuilder(avtaleByIdQuery)
                    .addNamedParameter("avtalenummer", QueryParameterValue.string(id))
                    .build();

            TableResult results = bigquery.query(queryConfig);
            Schema schema = results.getSchema();
            results
                    .iterateAll()
                    .forEach(row -> {
                        Map<String, String> mappedBiqQueryTable = new HashMap<>();
                        for(Field field : schema.getFields()) {
                            mappedBiqQueryTable.put(field.getName(), (String) row.get(field.getName()).getValue());
                        }
                        ObjectMapper mapper = new ObjectMapper();
                        aaregAvtaleList.add(mapper.convertValue(mappedBiqQueryTable, AaregAvtale.class));
                    });

            log.info("Query performed successfully.");
        } catch (BigQueryException | InterruptedException e) {
            log.error("Query not performed \n" + e);
        }

        if(aaregAvtaleList.size() >0) {
            return aaregAvtaleList.get(0);
        }
        else {
            return null;
        }
    }
}
